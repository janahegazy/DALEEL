
Copy

// This file imports all models and syncs them with MySQL
const { sequelize } = require('./db');
 
const syncModels = async () => {
  // Import all models so Sequelize registers them
  require('../models/User');
  require('../models/Location');
  require('../models/Review');
  require('../models/Other');
 
  await sequelize.sync({ alter: true });
  console.log('✅ All tables synced with MySQL');
};
 
module.exports = { syncModels };
 