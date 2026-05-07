const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool } = require('../config/db');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'daleel_secret', { expiresIn: '7d' });

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const pool = getPool();
    const [exists] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (exists.length) return res.status(400).json({ success: false, message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashed, role || 'user']
    );
    const token = signToken(result.insertId);
    res.status(201).json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = signToken(rows[0].id);
    res.json({ success: true, token, user: { id: rows[0].id, name: rows[0].name, email: rows[0].email, role: rows[0].role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const pool = getPool();
    await pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, req.user.id]);
    res.json({ success: true, message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const valid = await bcrypt.compare(oldPassword, req.user.password);
    if (!valid) return res.status(400).json({ success: false, message: 'Wrong password' });

    const hashed = await bcrypt.hash(newPassword, 10);
    const pool = getPool();
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
    res.json({ success: true, message: 'Password changed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const pool = getPool();
    await pool.query('DELETE FROM users WHERE id = ?', [req.user.id]);
    res.json({ success: true, message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};