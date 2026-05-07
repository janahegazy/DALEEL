const jwt = require('jsonwebtoken');
const { getPool } = require('../config/db');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized. No token.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'daleel_secret');
    const pool = getPool();
    const [rows] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [decoded.id]);
    if (!rows.length) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }
    req.user = rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized for this action.`
      });
    }
    next();
  };
};

const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'daleel_secret');
      const pool = getPool();
      const [rows] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [decoded.id]);
      if (rows.length) req.user = rows[0];
    }
  } catch (e) { /* ignore */ }
  next();
};

module.exports = { protect, authorize, optionalAuth };