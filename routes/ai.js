/**
 * Daleel AI Routes  —  /api/ai/*
 * Wire up all AI-powered features to Express endpoints
 */

const express = require('express');
const router  = express.Router();
const ai      = require('../ai_service');

// ── Helper: async error wrapper ──────────────────────────────────
const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// ─────────────────────────────────────────────────────────────────
// POST /api/ai/chat
// Body: { message: string, history: [{role, content}] }
// Returns: { reply: string }
// ─────────────────────────────────────────────────────────────────
router.post('/chat', wrap(async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ success: false, message: 'message is required' });
  }

  // Keep history to last 10 exchanges to stay within token limits
  const trimmedHistory = history.slice(-10);

  const reply = await ai.chatbot(trimmedHistory, message.trim());
  res.json({ success: true, reply });
}));

// ─────────────────────────────────────────────────────────────────
// POST /api/ai/recommend
// Body: { preferences: [], visitHistory: [], location: string, language: string }
// Returns: { recommendations: [] }
// ─────────────────────────────────────────────────────────────────
router.post('/recommend', wrap(async (req, res) => {
  const { preferences = [], visitHistory = [], location = 'Cairo', language = 'en' } = req.body;

  const recommendations = await ai.getRecommendations({
    preferences,
    visitHistory,
    location,
    language
  });

  res.json({ success: true, recommendations });
}));

// ─────────────────────────────────────────────────────────────────
// POST /api/ai/route
// Body: { origin: string, destination: string, preferences: [] }
// Returns: { advice: string }
// ─────────────────────────────────────────────────────────────────
router.post('/route', wrap(async (req, res) => {
  const { origin, destination, preferences = [] } = req.body;

  if (!origin || !destination) {
    return res.status(400).json({ success: false, message: 'origin and destination are required' });
  }

  const advice = await ai.routeAdvice(origin, destination, preferences);
  res.json({ success: true, advice });
}));

// ─────────────────────────────────────────────────────────────────
// POST /api/ai/emergency
// Body: { emergencyType: string, hasStaff: boolean, userLocation: string }
// Returns: { guide: string }
// ─────────────────────────────────────────────────────────────────
router.post('/emergency', wrap(async (req, res) => {
  const { emergencyType = 'General emergency', hasStaff = false, userLocation = '' } = req.body;

  const guide = await ai.emergencyGuide(emergencyType, hasStaff, userLocation);
  res.json({ success: true, guide });
}));

// ─────────────────────────────────────────────────────────────────
// POST /api/ai/analytics
// Body: { stats: object }
// Returns: { insight: string }
// ─────────────────────────────────────────────────────────────────
router.post('/analytics', wrap(async (req, res) => {
  const { stats = {} } = req.body;

  const insight = await ai.analyticsInsight(stats);
  res.json({ success: true, insight });
}));

module.exports = router;
