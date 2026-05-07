/**
 * Daleel AI Service — powered by Grok (xAI)
 * Handles: Chatbot, Recommendations, Route Advisor, Emergency Guide, Analytics
 */

const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';
const GROK_MODEL   = 'grok-3';

const DALEEL_SYSTEM = `You are Daleel Assistant — the AI built into the Daleel Wheelchair Accessibility Map platform.
You help wheelchair users and people with mobility challenges in Egypt and the Arab world.

Your personality: warm, direct, practical, empathetic. Always respond in the same language the user writes in (Arabic or English).

Platform context:
- Daleel maps accessible locations: ramps, elevators, accessible restrooms, step-free entrances
- Locations are tagged: Accessible ✅ / Partially Accessible ⚠️ / Not Accessible ❌
- Users can submit reports, reviews, and photos
- Emergency help button contacts on-site staff or emergency contacts (122 in Egypt)
- Route planner avoids stairs, steep slopes, narrow paths

Keep responses concise and actionable. Never make up specific addresses or phone numbers.`;

/**
 * Core function: send messages to Grok and get a response
 */
async function callGrok(messages, systemOverride = null, maxTokens = 600) {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) throw new Error('GROK_API_KEY not set in environment');

  const response = await fetch(GROK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: GROK_MODEL,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemOverride || DALEEL_SYSTEM },
        ...messages
      ]
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Grok API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// ─────────────────────────────────────────────
// 1. CHATBOT — general support assistant
// ─────────────────────────────────────────────
async function chatbot(conversationHistory, userMessage) {
  const messages = [
    ...conversationHistory,
    { role: 'user', content: userMessage }
  ];
  return callGrok(messages);
}

// ─────────────────────────────────────────────
// 2. RECOMMENDATIONS — personalized place suggestions
// ─────────────────────────────────────────────
async function getRecommendations(userProfile) {
  const { preferences = [], visitHistory = [], location = 'Cairo', language = 'en' } = userProfile;

  const system = `${DALEEL_SYSTEM}

You are generating JSON recommendations for the Recommendations page.
RESPOND ONLY with valid JSON — no markdown, no explanation, no extra text.`;

  const prompt = `User profile:
- Location: ${location}
- Preferences: ${preferences.join(', ') || 'general accessibility'}
- Recent visits: ${visitHistory.slice(0, 5).join(', ') || 'none yet'}
- Language: ${language}

Generate 6 accessible place recommendations as a JSON array.
Each object must have:
{
  "name": "Place Name",
  "category": "Restaurant|Mall|Park|University|Cafe|Hospital|Museum|Government",
  "accessibilityScore": 85,
  "accessibilityLevel": "Accessible|Partially Accessible|Not Accessible",
  "features": ["Wheelchair Ramp","Elevator","Accessible Restroom"],
  "reason": "Why this matches the user",
  "distance": "1.2 km",
  "rating": 4.5
}`;

  const raw = await callGrok(
    [{ role: 'user', content: prompt }],
    system,
    800
  );

  try {
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────
// 3. ROUTE ADVISOR
// ─────────────────────────────────────────────
async function routeAdvice(origin, destination, preferences = []) {
  const prompt = `A wheelchair user wants to travel from "${origin}" to "${destination}".
User preferences: ${preferences.join(', ') || 'standard wheelchair access'}.

Give practical route advice in 3-4 sentences covering:
1. General path recommendation (avoid stairs/steep slopes)
2. Key accessibility features to look for along the way
3. One potential challenge and how to handle it
4. Estimated effort level (Easy / Moderate / Challenging)

Be specific and practical. If location names sound like Egypt, mention Egyptian context.`;

  return callGrok([{ role: 'user', content: prompt }], null, 400);
}

// ─────────────────────────────────────────────
// 4. EMERGENCY GUIDE
// ─────────────────────────────────────────────
async function emergencyGuide(emergencyType, hasStaff, userLocation = '') {
  const system = `${DALEEL_SYSTEM}

You are helping someone in an EMERGENCY. Be calm, clear, and very concise.
Give numbered steps. Maximum 5 steps. Each step is one short sentence.`;

  const prompt = `Emergency type: "${emergencyType}"
On-site staff available: ${hasStaff ? 'Yes' : 'No'}
User location hint: ${userLocation || 'unknown'}

Give immediate step-by-step instructions for this wheelchair user emergency.`;

  return callGrok([{ role: 'user', content: prompt }], system, 300);
}

// ─────────────────────────────────────────────
// 5. ANALYTICS INSIGHT
// ─────────────────────────────────────────────
async function analyticsInsight(stats) {
  const prompt = `Here are Daleel platform accessibility statistics:
${JSON.stringify(stats, null, 2)}

Write a 3-sentence plain-language insight summary for an admin dashboard.
Focus on: biggest accessibility gap, most improved area, one actionable recommendation.
Be data-driven but conversational.`;

  return callGrok([{ role: 'user', content: prompt }], null, 300);
}

module.exports = { chatbot, getRecommendations, routeAdvice, emergencyGuide, analyticsInsight };

