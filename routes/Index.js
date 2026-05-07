//const express = require('express');
//const router = express.Router();
//const multer = require('multer');
//const path = require('path');
//const { protect, authorize, optionalAuth } = require('../middleware/auth');
//
//const storage = multer.diskStorage({
//  destination: (req, file, cb) => cb(null, 'uploads/'),
//  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_'))
//});
//const upload = multer({
//  storage,
//  limits: { fileSize: 5 * 1024 * 1024 },
//  fileFilter: (req, file, cb) => {
//    const allowed = /jpeg|jpg|png|gif|webp|pdf/;
//    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
//    const mime = allowed.test(file.mimetype);
//    if (ext && mime) return cb(null, true);
//    cb(new Error('Only images and PDFs are allowed.'));
//  }
//});
//
//const { register, login, getMe, updateProfile, changePassword, deleteAccount } = require('../controllers/authController');
//const { getLocations, getLocation, createLocation, updateLocation, deleteLocation, getAnalytics, saveLocation } = require('../controllers/locationController');
//const { reviewController, emergencyController, supportController, communityController, notificationController, adminController } = require('../controllers/mainControllers');
//
//router.post('/auth/register', register);
//router.post('/auth/login', login);
//router.get('/auth/me', protect, getMe);
//router.put('/auth/update-profile', protect, updateProfile);
//router.put('/auth/change-password', protect, changePassword);
//router.delete('/auth/delete-account', protect, deleteAccount);
//
//router.get('/locations/analytics', protect, authorize('admin', 'authority_representative'), getAnalytics);
//router.get('/locations', optionalAuth, getLocations);
//router.get('/locations/:id', optionalAuth, getLocation);
//router.post('/locations', protect, upload.array('photos', 5), createLocation);
//router.put('/locations/:id', protect, updateLocation);
//router.delete('/locations/:id', protect, authorize('admin', 'authority_representative'), deleteLocation);
//router.post('/locations/:id/save', protect, saveLocation);
//
//router.get('/reviews', reviewController.getByLocation);
//router.post('/reviews', protect, upload.array('photos', 3), reviewController.create);
//router.put('/reviews/:id/upvote', protect, reviewController.upvote);
//router.post('/reviews/:id/respond', protect, reviewController.respond);
//
//router.post('/emergency', protect, emergencyController.create);
//router.put('/emergency/:id/resolve', protect, emergencyController.resolve);
//router.get('/emergency/my', protect, emergencyController.getMy);
//
//router.post('/support', optionalAuth, upload.single('attachment'), supportController.create);
//router.get('/support/my', protect, supportController.getMy);
//
//router.get('/community', communityController.getAll);
//router.post('/community', protect, upload.array('photos', 3), communityController.create);
//router.put('/community/:id/like', protect, communityController.like)
//module.exports = router;
//const express = require("express");
//const router = express.Router();
//
//// test route
//router.get("/test", (req, res) => {
//  res.json({ message: "API is working 🚀" });
//});
//
//module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const { register, login, getMe, updateProfile, changePassword, deleteAccount } =
require('../controllers/authController');

const {
  getLocations,
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation,
  getAnalytics,
  saveLocation
} = require('../controllers/locationController');

const {
  reviewController,
  emergencyController,
  supportController,
  communityController
} = require('../controllers/mainControllers');


// ───────────── AUTH ─────────────
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', protect, getMe);
router.put('/auth/update-profile', protect, updateProfile);
router.put('/auth/change-password', protect, changePassword);
router.delete('/auth/delete-account', protect, deleteAccount);


// ───────────── LOCATIONS ─────────────
router.get('/locations', optionalAuth, getLocations);
router.get('/locations/:id', optionalAuth, getLocation);
router.post('/locations', protect, createLocation);
router.put('/locations/:id', protect, updateLocation);
router.delete('/locations/:id', protect, authorize('admin', 'authority_representative'), deleteLocation);
router.get('/locations/analytics', protect, authorize('admin', 'authority_representative'), getAnalytics);
router.post('/locations/:id/save', protect, saveLocation);


// ───────────── REVIEWS ─────────────
router.get('/reviews', reviewController.getByLocation);
router.post('/reviews', protect, reviewController.create);


// ───────────── EMERGENCY ─────────────
router.post('/emergency', protect, emergencyController.create);
router.put('/emergency/:id/resolve', protect, emergencyController.resolve);


// ───────────── SUPPORT ─────────────
router.post('/support', optionalAuth, supportController.create);
router.get('/support/my', protect, supportController.getMy);


// ───────────── COMMUNITY ─────────────
router.get('/community', communityController.getAll);
router.post('/community', protect, communityController.create);


// ───────────── TEST ROUTE (صح هنا 👇) ─────────────
router.get("/test", (req, res) => {
  res.json({ message: "API is working 🚀" });
});

module.exports = router;