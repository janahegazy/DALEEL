const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

// ─── Emergency ───────────────────────────────
class Emergency extends Model {}
Emergency.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  location: {
    type: DataTypes.TEXT, defaultValue: null,
    get() { const r = this.getDataValue('location'); try { return r ? JSON.parse(r) : null; } catch { return null; } },
    set(v) { this.setDataValue('location', v ? JSON.stringify(v) : null); }
  },
  status: { type: DataTypes.ENUM('active','notified','resolved'), defaultValue: 'active' },
  contactsNotified: {
    type: DataTypes.TEXT, defaultValue: '[]',
    get() { const r = this.getDataValue('contactsNotified'); try { return r ? JSON.parse(r) : []; } catch { return []; } },
    set(v) { this.setDataValue('contactsNotified', JSON.stringify(v)); }
  },
  emergencyServiceCalled: { type: DataTypes.BOOLEAN, defaultValue: false },
  resolvedBy: { type: DataTypes.INTEGER, defaultValue: null },
  notes: { type: DataTypes.TEXT, defaultValue: null },
  resolvedAt: { type: DataTypes.DATE, defaultValue: null }
}, { sequelize, modelName: 'Emergency', tableName: 'emergencies', timestamps: true });

// ─── Notification ────────────────────────────
class Notification extends Model {}
Notification.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  type: {
    type: DataTypes.ENUM('app_update','new_feature','new_venue','ramp_closure','elevator_outage',
      'review_upvote','new_comment','review_approved','review_rejected',
      'emergency','accessibility_update','badge_earned'),
    allowNull: false
  },
  title: { type: DataTypes.STRING(200), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  link: { type: DataTypes.STRING(500), defaultValue: null }
}, { sequelize, modelName: 'Notification', tableName: 'notifications', timestamps: true });

// ─── SupportTicket ───────────────────────────
class SupportTicket extends Model {}
SupportTicket.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  ticketId: { type: DataTypes.STRING(20), unique: true },
  userId: { type: DataTypes.INTEGER, defaultValue: null },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false },
  subject: { type: DataTypes.STRING(300), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  attachment: { type: DataTypes.STRING(500), defaultValue: null },
  status: { type: DataTypes.ENUM('open','in_progress','resolved','closed'), defaultValue: 'open' },
  assignedTo: { type: DataTypes.INTEGER, defaultValue: null },
  responses: {
    type: DataTypes.TEXT, defaultValue: '[]',
    get() { const r = this.getDataValue('responses'); try { return r ? JSON.parse(r) : []; } catch { return []; } },
    set(v) { this.setDataValue('responses', JSON.stringify(v)); }
  }
}, {
  sequelize, modelName: 'SupportTicket', tableName: 'support_tickets', timestamps: true,
  hooks: {
    beforeCreate: (ticket) => {
      if (!ticket.ticketId) {
        ticket.ticketId = '#' + Math.floor(10000 + Math.random() * 90000);
      }
    }
  }
});

// ─── SavedLocation ────────────────────────────
class SavedLocation extends Model {}
SavedLocation.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  locationId: { type: DataTypes.INTEGER, allowNull: false }
}, { sequelize, modelName: 'SavedLocation', tableName: 'saved_locations', timestamps: true });

// ─── Route ───────────────────────────────────
class Route extends Model {}
Route.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  origin: {
    type: DataTypes.TEXT, defaultValue: null,
    get() { const r = this.getDataValue('origin'); try { return r ? JSON.parse(r) : null; } catch { return null; } },
    set(v) { this.setDataValue('origin', v ? JSON.stringify(v) : null); }
  },
  destination: {
    type: DataTypes.TEXT, defaultValue: null,
    get() { const r = this.getDataValue('destination'); try { return r ? JSON.parse(r) : null; } catch { return null; } },
    set(v) { this.setDataValue('destination', v ? JSON.stringify(v) : null); }
  },
  distance: { type: DataTypes.INTEGER, defaultValue: null },
  duration: { type: DataTypes.INTEGER, defaultValue: null },
  obstacles: {
    type: DataTypes.TEXT, defaultValue: '[]',
    get() { const r = this.getDataValue('obstacles'); try { return r ? JSON.parse(r) : []; } catch { return []; } },
    set(v) { this.setDataValue('obstacles', JSON.stringify(v)); }
  },
  isSaved: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { sequelize, modelName: 'Route', tableName: 'routes', timestamps: true });

// ─── CommunityPost ───────────────────────────
class CommunityPost extends Model {}
CommunityPost.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  authorId: { type: DataTypes.INTEGER, allowNull: false },
  group_name: { type: DataTypes.STRING(100), defaultValue: 'general' },
  content: { type: DataTypes.TEXT, allowNull: false },
  photos: {
    type: DataTypes.TEXT, defaultValue: '[]',
    get() { const r = this.getDataValue('photos'); try { return r ? JSON.parse(r) : []; } catch { return []; } },
    set(v) { this.setDataValue('photos', JSON.stringify(v)); }
  },
  type: { type: DataTypes.ENUM('post','event'), defaultValue: 'post' },
  eventDate: { type: DataTypes.DATE, defaultValue: null },
  eventLocation: { type: DataTypes.STRING(500), defaultValue: null },
  likes: {
    type: DataTypes.TEXT, defaultValue: '[]',
    get() { const r = this.getDataValue('likes'); try { return r ? JSON.parse(r) : []; } catch { return []; } },
    set(v) { this.setDataValue('likes', JSON.stringify(v)); }
  },
  comments: {
    type: DataTypes.TEXT, defaultValue: '[]',
    get() { const r = this.getDataValue('comments'); try { return r ? JSON.parse(r) : []; } catch { return []; } },
    set(v) { this.setDataValue('comments', JSON.stringify(v)); }
  },
  isReported: { type: DataTypes.BOOLEAN, defaultValue: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { sequelize, modelName: 'CommunityPost', tableName: 'community_posts', timestamps: true });

// ─── Backup ──────────────────────────────────
class Backup extends Model {}
Backup.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  version: { type: DataTypes.STRING(50), allowNull: false },
  createdBy: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.ENUM('automatic','manual'), defaultValue: 'manual' },
  size: { type: DataTypes.STRING(50), defaultValue: 'N/A' },
  status: { type: DataTypes.ENUM('success','failed'), defaultValue: 'success' },
  notes: { type: DataTypes.TEXT, defaultValue: null }
}, { sequelize, modelName: 'Backup', tableName: 'backups', timestamps: true });

module.exports = { Emergency, Notification, SupportTicket, SavedLocation, Route, CommunityPost, Backup };