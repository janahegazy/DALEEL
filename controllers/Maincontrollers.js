const { getPool } = require('../config/db');

// ── Reviews ──────────────────────────────────
exports.reviewController = {
  getByLocation: async (req, res) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM reviews WHERE location_id = ?', [req.query.location_id]);
      res.json({ success: true, data: rows });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  getAll: async (req, res) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM reviews');
      res.json({ success: true, data: rows });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  create: async (req, res) => {
    try {
      const { location_id, rating, comment } = req.body;
      const pool = getPool();
      const [result] = await pool.query(
        'INSERT INTO reviews (location_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
        [location_id, req.user.id, rating, comment]
      );
      res.status(201).json({ success: true, id: result.insertId });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  upvote: async (req, res) => {
    try {
      const pool = getPool();
      await pool.query('UPDATE reviews SET upvotes = upvotes + 1 WHERE id = ?', [req.params.id]);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  respond: async (req, res) => {
    try {
      const pool = getPool();
      await pool.query('UPDATE reviews SET response = ? WHERE id = ?', [req.body.response, req.params.id]);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  moderate: async (req, res) => {
    try {
      const pool = getPool();
      await pool.query('UPDATE reviews SET status = ? WHERE id = ?', [req.body.status, req.params.id]);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
};

// ── Emergency ─────────────────────────────────
exports.emergencyController = {
  create: async (req, res) => {
    try {
      const { lat, lng, description } = req.body;
      const pool = getPool();
      const [result] = await pool.query(
        'INSERT INTO emergencies (user_id, lat, lng, description) VALUES (?, ?, ?, ?)',
        [req.user.id, lat, lng, description]
      );
      res.status(201).json({ success: true, id: result.insertId });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  resolve: async (req, res) => {
    try {
      const pool = getPool();
      await pool.query('UPDATE emergencies SET status = "resolved" WHERE id = ?', [req.params.id]);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  getMy: async (req, res) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM emergencies WHERE user_id = ?', [req.user.id]);
      res.json({ success: true, data: rows });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
};

// ── Support ───────────────────────────────────
exports.supportController = {
  create: async (req, res) => {
    try {
      const { subject, message } = req.body;
      const pool = getPool();
      const [result] = await pool.query(
        'INSERT INTO support_tickets (user_id, subject, message) VALUES (?, ?, ?)',
        [req.user?.id || null, subject, message]
      );
      res.status(201).json({ success: true, id: result.insertId });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  getMy: async (req, res) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM support_tickets WHERE user_id = ?', [req.user.id]);
      res.json({ success: true, data: rows });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  getAll: async (req, res) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM support_tickets');
      res.json({ success: true, data: rows });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  updateStatus: async (req, res) => {
    try {
      const pool = getPool();
      await pool.query('UPDATE support_tickets SET status = ? WHERE id = ?', [req.body.status, req.params.id]);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
};

// ── Community ─────────────────────────────────
exports.communityController = {
  getAll: async (req, res) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM community_posts ORDER BY created_at DESC');
      res.json({ success: true, data: rows });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  create: async (req, res) => {
    try {
      const { content } = req.body;
      const pool = getPool();
      const [result] = await pool.query(
        'INSERT INTO community_posts (user_id, content) VALUES (?, ?)',
        [req.user.id, content]
      );
      res.status(201).json({ success: true, id: result.insertId });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  like: async (req, res) => {
    try {
      const pool = getPool();
      await pool.query('UPDATE community_posts SET likes = likes + 1 WHERE id = ?', [req.params.id]);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  comment: async (req, res) => {
    try {
      const pool = getPool();
      await pool.query(
        'INSERT INTO post_comments (post_id, user_id, comment) VALUES (?, ?, ?)',
        [req.params.id, req.user.id, req.body.comment]
      );
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
};

// ── Notifications ─────────────────────────────
exports.notificationController = {
  getMy: async (req, res) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
      res.json({ success: true, data: rows });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  markRead: async (req, res) => {
    try {
      const pool = getPool();
      await pool.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [req.params.id]);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  markAllRead: async (req, res) => {
    try {
      const pool = getPool();
      await pool.query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [req.user.id]);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
};

// ── Admin ─────────────────────────────────────
exports.adminController = {
  getStats: async (req, res) => {
    try {
      const pool = getPool();
      const [[{ users }]] = await pool.query('SELECT COUNT(*) as users FROM users');
      const [[{ locations }]] = await pool.query('SELECT COUNT(*) as locations FROM locations');
      const [[{ reviews }]] = await pool.query('SELECT COUNT(*) as reviews FROM reviews');
      res.json({ success: true, data: { users, locations, reviews } });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  getUsers: async (req, res) => {
    try {
      const pool = getPool();
      const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM users');
      res.json({ success: true, data: rows });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  updateUserRole: async (req, res) => {
    try {
      const pool = getPool();
      await pool.query('UPDATE users SET role = ? WHERE id = ?', [req.body.role, req.params.id]);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  suspendUser: async (req, res) => {
    try {
      const pool = getPool();
      await pool.query('UPDATE users SET suspended = ? WHERE id = ?', [req.body.suspended, req.params.id]);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },
  getBackups: async (req, res) => {
    res.json({ success: true, data: [] });
  },
  createBackup: async (req, res) => {
    res.json({ success: true, message: 'Backup created' });
  },
};