const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Location extends Model {}

Location.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(200), allowNull: false },
    category: {
      type: DataTypes.ENUM('restaurant','park','shop','public_building','hospital','hotel','transport','university','mall','government','other'),
      allowNull: false
    },
    address: { type: DataTypes.STRING(500), allowNull: false },

    // Coordinates
    lat: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
    lng: { type: DataTypes.DECIMAL(10, 7), allowNull: false },

    accessibilityStatus: {
      type: DataTypes.ENUM('accessible', 'partially_accessible', 'not_accessible'),
      defaultValue: 'partially_accessible'
    },
    accessibilityScore: { type: DataTypes.DECIMAL(3, 1), defaultValue: 0 },

    // Accessibility features as JSON
    features: {
      type: DataTypes.TEXT,
      defaultValue: JSON.stringify({
        hasRamp: false, hasElevator: false, hasAccessibleRestroom: false,
        hasAutomaticDoors: false, hasDesignatedParking: false,
        hasSignage: false, hasStepFreeEntrance: false
      }),
      get() {
        const raw = this.getDataValue('features');
        try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
      },
      set(value) {
        this.setDataValue('features', JSON.stringify(value));
      }
    },

    // Photos as JSON array
    photos: {
      type: DataTypes.TEXT,
      defaultValue: '[]',
      get() {
        const raw = this.getDataValue('photos');
        try { return raw ? JSON.parse(raw) : []; } catch { return []; }
      },
      set(value) {
        this.setDataValue('photos', JSON.stringify(value));
      }
    },

    description: { type: DataTypes.TEXT, defaultValue: null },
    submittedBy: { type: DataTypes.INTEGER, defaultValue: null },
    businessOwner: { type: DataTypes.INTEGER, defaultValue: null },
    totalReviews: { type: DataTypes.INTEGER, defaultValue: 0 },
    averageRating: { type: DataTypes.DECIMAL(3, 1), defaultValue: 0 },
    totalVisits: { type: DataTypes.INTEGER, defaultValue: 0 },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
  },
  {
    sequelize,
    modelName: 'Location',
    tableName: 'locations',
    timestamps: true
  }
);

module.exports = Location;