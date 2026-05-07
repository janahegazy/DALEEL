// config/db.js
const mysql = require('mysql2/promise');

let pool;

const connectDB = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'janahegazy2372005',
      database: process.env.DB_NAME || 'daleel',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
    });

    // اختبر الاتصال
    await pool.query('SELECT 1');
    console.log('✅ MySQL Connected');
  } catch (error) {
    console.error(`❌ MySQL Error: ${error.message}`);
    process.exit(1);
  }
};

// الـ routes هتستخدم الـ pool ده مباشرة
const getPool = () => pool;

module.exports = { connectDB, getPool };