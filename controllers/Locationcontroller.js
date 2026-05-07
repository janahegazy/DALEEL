const { getPool } = require('../config/db');

exports.getLocations = async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM locations');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLocation = async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM locations WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createLocation = async (req, res) => {
  try {
    const { name, lat, lng, description, category } = req.body;
    const pool = getPool();
    const [result] = await pool.query(
      'INSERT INTO locations (name, lat, lng, description, category, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, lat, lng, description, category, req.user.id]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const pool = getPool();
    await pool.query(
      'UPDATE locations SET name = ?, description = ?, category = ? WHERE id = ?',
      [name, description, category, req.params.id]
    );
    res.json({ success: true, message: 'Updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const pool = getPool();
    await pool.query('DELETE FROM locations WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const pool = getPool();
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM locations');
    res.json({ success: true, data: { total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.saveLocation = async (req, res) => {
  try {
    const pool = getPool();
    await pool.query(
      'INSERT IGNORE INTO saved_locations (user_id, location_id) VALUES (?, ?)',
      [req.user.id, req.params.id]
    );
    res.json({ success: true, message: 'Saved' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};