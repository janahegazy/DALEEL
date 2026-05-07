const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Review extends Model {}

Review.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    locationId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },

    photos: {
      type: DataTypes.TEXT,
      defaultValue: '[]',
      get() {
        const raw = this.getDataValue('photos');
        try { return raw ? JSON.parse(raw) : []; } catch { return []; }
      },
      set(value) { this.setDataValue('photos', JSON.stringify(value)); }
    },

    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    moderatedBy: { type: DataTypes.INTEGER, defaultValue: null },

    // Owner response as JSON
    ownerResponse: {
      type: DataTypes.TEXT,
      defaultValue: null,
      get() {
        const raw = this.getDataValue('ownerResponse');
        try { return raw ? JSON.parse(raw) : null; } catch { return null; }
      },
      set(value) { this.setDataValue('ownerResponse', value ? JSON.stringify(value) : null); }
    },

    // Upvote user IDs as JSON array
    upvotes: {
      type: DataTypes.TEXT,
      defaultValue: '[]',
      get() {
        const raw = this.getDataValue('upvotes');
        try { return raw ? JSON.parse(raw) : []; } catch { return []; }
      },
      set(value) { this.setDataValue('upvotes', JSON.stringify(value)); }
    },

    isReported: { type: DataTypes.BOOLEAN, defaultValue: false },
    reportReason: { type: DataTypes.STRING(500), defaultValue: null }
  },
  {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: true
  }
);

module.exports = Review;