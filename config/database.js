const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'daleel',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Connected via Sequelize');

    // Sync all models - creates tables if they don't exist
    const { syncModels } = require('./syncModels');
    await syncModels();

  } catch (error) {
    console.error('❌ MySQL Error:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };