const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { getPool } = require('../config/db');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'daleel_secret', { expiresIn: '7d' });

// ─────────────────────────────────────────
//  REGISTER
// ─────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const pool = getPool();

    // 1. إيميل موجود قبل كده؟
    const [exists] = await pool.query(
      'SELECT id FROM users WHERE email = ?', [email]
    );
    if (exists.length)
      return res.status(400).json({ success: false, message: 'Email already exists' });

    // 2. جيب الـ role_id من جدول roles
    const roleKey = role || 'regular_user';
    const [roleRows] = await pool.query(
      'SELECT id FROM roles WHERE role_key = ?', [roleKey]
    );
    if (!roleRows.length)
      return res.status(400).json({ success: false, message: 'Invalid role' });
    const role_id = roleRows[0].id;

    // 3. hash الباسورد
    const password_hash = await bcrypt.hash(password, 10);

    // 4. احفظ اليوزر بأسماء الأعمدة الصح
    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
      [name, email, password_hash, role_id]
    );

    const token = signToken(result.insertId);
    res.status(201).json({ success: true, token });

  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────
//  LOGIN
// ─────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const pool = getPool();

    // جيب اليوزر مع الـ role_key من جدول roles
    const [rows] = await pool.query(
      `SELECT u.id, u.full_name AS name, u.email, u.password_hash, r.role_key AS role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = ?`,
      [email]
    );
    if (!rows.length)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const user = rows[0];

    // قارن الباسورد بالـ hash
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = signToken(user.id);
    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────
//  GET ME
// ─────────────────────────────────────────
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// ─────────────────────────────────────────
//  UPDATE PROFILE
// ─────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const pool = getPool();
    await pool.query(
      'UPDATE users SET full_name = ?, email = ? WHERE id = ?',
      [name, email, req.user.id]
    );
    res.json({ success: true, message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────
//  CHANGE PASSWORD
// ─────────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const pool = getPool();

    // جيب الـ hash الحالي
    const [rows] = await pool.query(
      'SELECT password_hash FROM users WHERE id = ?', [req.user.id]
    );
    const valid = await bcrypt.compare(oldPassword, rows[0].password_hash);
    if (!valid)
      return res.status(400).json({ success: false, message: 'Wrong password' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password_hash = ? WHERE id = ?', [hashed, req.user.id]
    );
    res.json({ success: true, message: 'Password changed' });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─────────────────────────────────────────
//  DELETE ACCOUNT
// ─────────────────────────────────────────
exports.deleteAccount = async (req, res) => {
  try {
    const pool = getPool();
    await pool.query('DELETE FROM users WHERE id = ?', [req.user.id]);
    res.json({ success: true, message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};