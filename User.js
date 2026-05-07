const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');

class User extends Model {
  // Compare plain password to hashed
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Hide password from JSON output
  toJSON() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  }
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    role: {
      type: DataTypes.ENUM('regular_user', 'business_owner', 'admin', 'authority_representative', 'security_staff'),
      defaultValue: 'regular_user'
    },
    avatar: { type: DataTypes.STRING(500), defaultValue: null },
    phone: { type: DataTypes.STRING(30), defaultValue: null },
    language: { type: DataTypes.ENUM('en', 'ar'), defaultValue: 'en' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },

    // Preferences stored as JSON string
    preferences: {
      type: DataTypes.TEXT,
      defaultValue: JSON.stringify({
        preferGentleRamp: false,
        requireAccessibleRestroom: false,
        notifyNewVenues: true,
        notifyRampClosures: true,
        notifyElevatorOutages: true,
        notifyAppUpdates: true,
        notifyNewFeatures: true,
        notifyReviewUpvotes: true,
        notifyComments: false
      }),
      get() {
        const raw = this.getDataValue('preferences');
        try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
      },
      set(value) {
        this.setDataValue('preferences', JSON.stringify(value));
      }
    },

    // Emergency contacts stored as JSON string
    emergencyContacts: {
      type: DataTypes.TEXT,
      defaultValue: '[]',
      get() {
        const raw = this.getDataValue('emergencyContacts');
        try { return raw ? JSON.parse(raw) : []; } catch { return []; }
      },
      set(value) {
        this.setDataValue('emergencyContacts', JSON.stringify(value));
      }
    },

    // Badges stored as JSON array string
    badges: {
      type: DataTypes.TEXT,
      defaultValue: '[]',
      get() {
        const raw = this.getDataValue('badges');
        try { return raw ? JSON.parse(raw) : []; } catch { return []; }
      },
      set(value) {
        this.setDataValue('badges', JSON.stringify(value));
      }
    },

    contributionCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    photoCount: { type: DataTypes.INTEGER, defaultValue: 0 }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    hooks: {
      // Hash password before creating or updating
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      }
    }
  }
);

module.exports = User;