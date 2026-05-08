# 🦽 Daleel — Wheelchair Accessibility Map

> *"Daleel" (دليل) means "Guide" in Arabic — your smart guide to an accessible world.*

[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-brightgreen?logo=node.js)](https://nodejs.org)
[![MySQL](https://img.shields.io/badge/Database-MySQL-blue?logo=mysql)](https://www.mysql.com)
[![Frontend](https://img.shields.io/badge/Frontend-HTML%20%2F%20TailwindCSS-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![AI](https://img.shields.io/badge/AI-Grok%20API%20(xAI)-black?logo=x)](https://x.ai)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [1. Tech Stack](#1-tech-stack)
- [2. Key APIs & Open Datasets](#2-key-apis--open-datasets)
- [3. MVP Scope](#3-mvp-scope)
- [4. Data Pipeline](#4-data-pipeline)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Team](#-team)

---

## 🌍 Overview

**Daleel** is a community-driven web platform that helps wheelchair users and people with mobility challenges find, rate, and navigate accessible locations. It combines user-generated reviews, real-time data, and AI-powered recommendations to make the world more accessible — one location at a time.

---

## 1. Tech Stack

### 🔧 Language & Runtime

| Layer | Technology | Reason |
|---|---|---|
| Runtime | **Node.js v18+** | Non-blocking I/O, great for real-time features |
| Language | **JavaScript (ES2022)** | Unified language across frontend and backend |
| Backend Framework | **Express.js v4** | Lightweight, flexible REST API |
| Database | **MySQL 8** via **MySQL Workbench** | Relational data, structured accessibility records |
| ORM | **Sequelize v6** | Clean model definitions, auto table sync |
| Auth | **JWT (jsonwebtoken)** | Stateless, scalable token-based auth |
| Password Hashing | **bcryptjs** | Secure password storage |
| File Uploads | **Multer** | Handles photo uploads for locations & reviews |
| Real-time | **Socket.IO** | Live emergency alerts, notifications |
| Frontend | **HTML5 + TailwindCSS CDN** | Fast UI development, no build step needed |

### 🤖 AI Model — Grok API (xAI)

We chose **Grok** by [xAI](https://x.ai) as our AI engine for the following features:

| Feature | How Grok Is Used |
|---|---|
| 🔍 **Intelligent Recommendations** | Grok analyzes a user's visited locations, saved places, and preferences to generate personalized accessible location suggestions |
| 💬 **AI Support Chatbot** | Grok powers the in-app support assistant, answering questions about accessibility features, app usage, and location details |
| 📊 **Analytics Summary** | Grok generates natural-language monthly reports summarizing regional accessibility trends |
| 🗣️ **Review Sentiment** | Grok reads user reviews and extracts accessibility sentiment scores to supplement star ratings |

**Why Grok over GPT/Gemini?**
- Real-time web awareness (X/Twitter data on accessibility news)
- Generous context window for processing location + review data
- Fast inference suitable for live chatbot responses
- Open API compatible with standard REST calls

```js
// Example: Calling Grok API for recommendations
const response = await fetch('https://api.x.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'grok-beta',
    messages: [
      {
        role: 'system',
        content: 'You are an accessibility expert. Recommend wheelchair-friendly locations based on user history.'
      },
      {
        role: 'user',
        content: `User has visited: ${userHistory}. Suggest 3 new accessible places near ${userLocation}.`
      }
    ]
  })
});
```

---

## 2. Key APIs & Open Datasets

### 🗺️ Mapping & Location

| API / Dataset | Purpose | Status | Access |
|---|---|---|---|
| **OpenStreetMap (OSM)** | Base map tiles, accessible path data | ✅ Tested & Free | [openstreetmap.org](https://www.openstreetmap.org) |
| **Leaflet.js** | Interactive map rendering + heatmap | ✅ Integrated | [leafletjs.com](https://leafletjs.com) |
| **Leaflet.heat** | Accessibility data heatmap visualization | ✅ Integrated | [GitHub](https://github.com/Leaflet/Leaflet.heat) |
| **Nominatim API** (OSM) | Free geocoding — address → lat/lng | ✅ Tested | `https://nominatim.openstreetmap.org/search` |
| **OpenRouteService** | Wheelchair-friendly route planning | 🔄 In Progress | [openrouteservice.org](https://openrouteservice.org) |

**Nominatim Test:**
```bash
curl "https://nominatim.openstreetmap.org/search?q=Cairo+Library&format=json&limit=1"
# Returns: lat, lon, display_name ✅
```

### ♿ Accessibility Open Datasets

| Dataset | Source | Format | Usage |
|---|---|---|---|
| **Wheelmap.org API** | Open wheelchair location data (global) | JSON REST | Seed initial accessible locations |
| **OpenAccessibilityData** | Ramp, elevator, restroom locations | GeoJSON | Import into `locations` table |
| **OSM Wheelchair Tag** | `wheelchair=yes/limited/no` on OSM features | Overpass API | Validate and enrich location records |

**Overpass API Test (OSM wheelchair data):**
```bash
# Get wheelchair-accessible restaurants in Cairo
curl -X POST "https://overpass-api.de/api/interpreter" \
  --data '[out:json];node["amenity"="restaurant"]["wheelchair"="yes"](29.9,31.1,30.1,31.4);out body;'
# Returns GeoJSON nodes with accessibility tags ✅
```

### ✅ API Access Tests — Confirmed Working

The following APIs were tested and confirmed accessible before integration:

| API | Endpoint Tested | Result | Notes |
|---|---|---|---|
| **OSM Nominatim** | `/search?q=Cairo+Library&format=json` | ✅ Returns lat/lon | No key needed |
| **Overpass API** | `/api/interpreter` wheelchair nodes Cairo | ✅ Returns GeoJSON nodes | No key needed |
| **Leaflet CDN** | `unpkg.com/leaflet@1.9.4` | ✅ Map renders | No key needed |
| **Leaflet.heat CDN** | `unpkg.com/leaflet.heat@0.2.0` | ✅ Heatmap renders | No key needed |
| **CartoDB Dark Tiles** | `{s}.basemaps.cartocdn.com/dark_all` | ✅ Tiles load | No key needed |
| **Grok API (xAI)** | `api.x.ai/v1/chat/completions` | 🔑 Requires API key | Free tier at [x.ai](https://x.ai) |
| **OpenRouteService** | `/v2/directions/wheelchair` | 🔄 Key pending | Free: 2000 req/day |

> All free APIs were tested live with `curl` before integration. Grok API code is ready — only needs `GROK_API_KEY` in `.env`.

**Run these tests yourself right now:**

```bash
# Test 1 — Nominatim geocoding (no key needed)
curl "https://nominatim.openstreetmap.org/search?q=Cairo+Egypt&format=json&limit=1" \
  | python3 -m json.tool
# Expected: lat=30.06, lon=31.24 ✅

# Test 2 — OSM wheelchair nodes in Cairo (no key needed)
curl -s -X POST "https://overpass-api.de/api/interpreter" \
  --data '[out:json];node["wheelchair"="yes"](29.9,31.1,30.1,31.4);out body;' \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Found {len(d[\"elements\"])} wheelchair nodes ✅')"

# Test 3 — Your backend health check (after npm run dev)
curl http://localhost:5000/health
# Expected: {"status":"ok","uptime":...} ✅

# Test 4 — Your API locations endpoint
curl http://localhost:5000/api/locations
# Expected: {"success":true,"data":[...]} ✅
```

---

### 🔔 Supporting APIs

| API | Purpose | Free Tier |
|---|---|---|
| **Nodemailer + Gmail SMTP** | Email notifications, ticket confirmations | ✅ Free |
| **Socket.IO** | Real-time emergency alerts | ✅ Built-in |
| **Grok API (xAI)** | AI recommendations, chatbot, analytics | 🔑 API key required |

---

## 3. MVP Scope

The MVP (Minimum Viable Product) is the **bare minimum needed to demonstrate** Daleel's core value: *helping wheelchair users find and rate accessible locations.*

### ✅ MVP Features (Must Have)

```
AUTH
 ├── User registration (email + password)
 ├── Login with JWT token
 └── Role-based access: Regular User, Business Owner, Admin

LOCATIONS
 ├── View list of accessible locations on map
 ├── Search by name or address
 ├── View location details (features, rating, photos)
 └── Add a new location (user contribution)

REVIEWS
 ├── Submit a star rating + text review
 ├── View community reviews per location
 └── Admin can approve / reject reviews

DASHBOARDS
 ├── Regular User: saved locations, contributions, badges
 ├── Business Owner: manage their location, respond to reviews
 └── Admin: user list, review moderation, basic stats

EMERGENCY
 └── One-tap SOS button → notify emergency contacts
```

### ❌ Out of MVP Scope (Later Phases)

```
- OAuth (Google / Facebook login)
- Turn-by-turn wheelchair navigation
- Offline map mode
- Mobile app (iOS / Android)
- AI recommendations (needs Grok API key)
- Multi-language full support (Arabic RTL)
- Advanced analytics charts
- Automated backup system
```

### 🎯 Demo Flow (5 minutes)

```
1. Open welcome page → click Get Started
2. Register as Regular User
3. Browse interactive map → click a location
4. View accessibility details + community reviews
5. Submit a review with star rating
6. Open Admin panel → approve the review
7. Show emergency SOS button
```

---

## 4. Data Pipeline

### 🔄 Pipeline Overview

```
[Data Sources] → [Ingestion] → [Processing] → [Storage] → [Output]
```

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA SOURCES                             │
│  OSM / Wheelmap API │ User Submissions │ Reviews │ Grok AI      │
└────────────┬────────────────┬──────────────────────────────────┘
             │                │
             ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        INGESTION LAYER                          │
│                                                                 │
│  seed.js (Node)          REST API (Express)                     │
│  ─────────────           ───────────────────                    │
│  • Fetches OSM data      • POST /api/locations                  │
│  • Fetches Wheelmap      • POST /api/reviews                    │
│  • Normalizes fields     • POST /api/auth/register              │
│  • Bulk inserts to DB    • Multer handles photos                │
└────────────┬────────────────┬──────────────────────────────────┘
             │                │
             ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       PROCESSING LAYER                          │
│                                                                 │
│  locationController.js       reviewController.js               │
│  ───────────────────         ────────────────────              │
│  • Validate coordinates      • Validate rating (1-5)           │
│  • Compute accessScore       • Sentiment via Grok API          │
│  • Extract features JSON     • Update location avgRating       │
│  • Geocode via Nominatim     • Award user badges               │
│  • Tag accessibility status  • Trigger notifications           │
│                                                                 │
│  Python (optional analytics)                                    │
│  ────────────────────────────                                   │
│  • connection.py → MySQL query                                  │
│  • Aggregate ratings by area                                    │
│  • Generate heatmap data points                                 │
│  • Output JSON for Leaflet.heat                                 │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        STORAGE LAYER                            │
│                                                                 │
│   MySQL Database (daleel)                                       │
│   ┌──────────┐  ┌───────────┐  ┌──────────────┐               │
│   │  users   │  │ locations │  │   reviews    │               │
│   ├──────────┤  ├───────────┤  ├──────────────┤               │
│   │ id       │  │ id        │  │ id           │               │
│   │ name     │  │ name      │  │ locationId   │               │
│   │ email    │  │ lat / lng │  │ userId       │               │
│   │ role     │  │ features  │  │ rating       │               │
│   │ badges   │  │ avgRating │  │ content      │               │
│   └──────────┘  └───────────┘  │ status       │               │
│                                └──────────────┘               │
│   + notifications, emergencies, support_tickets,               │
│     community_posts, saved_locations, backups                  │
│                                                                 │
│   /uploads/  → local file storage for photos                   │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         OUTPUT LAYER                            │
│                                                                 │
│  REST API responses (JSON)    Socket.IO events                  │
│  ─────────────────────────    ───────────────────              │
│  • GET /api/locations         • emergency:new                  │
│  • GET /api/reviews           • notification:push              │
│  • GET /api/admin/stats       • review:approved                │
│                                                                 │
│  Frontend Pages               AI Output                        │
│  ──────────────               ─────────────                    │
│  • Interactive map            • Grok recommendations           │
│  • Admin dashboard            • Chatbot responses              │
│  • Heatmap (Leaflet.heat)     • Analytics summaries            │
│  • Reports + CSV export       • Sentiment scores               │
└─────────────────────────────────────────────────────────────────┘
```

### 📥 Ingestion — Seeding from OSM

```js
// src/utils/seed.js — simplified ingestion example
const fetchOSMData = async () => {
  const query = `
    [out:json];
    node["wheelchair"="yes"](29.9,31.1,30.1,31.4);
    out body;
  `;
  const res  = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST', body: query
  });
  const data = await res.json();

  for (const node of data.elements) {
    await pool.query(
      `INSERT IGNORE INTO locations (name, lat, lng, address, category, isVerified)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        node.tags.name || 'Unknown Location',
        node.lat,
        node.lon,
        node.tags['addr:street'] || 'Unknown Address',
        node.tags.amenity || 'other',
        true
      ]
    );
  }
};
```

### ⚙️ Processing — Accessibility Score Calculation

```js
// Computed when a new review is submitted
const updateLocationScore = async (locationId) => {
  const [rows] = await pool.query(
    `SELECT AVG(rating) as avg, COUNT(*) as total
     FROM reviews WHERE location_id = ? AND status = 'approved'`,
    [locationId]
  );
  const avg   = parseFloat(rows[0].avg).toFixed(1);
  const total = rows[0].total;

  // Map avg rating to accessibility status
  const status = avg >= 4.0 ? 'accessible'
               : avg >= 2.5 ? 'partially_accessible'
               : 'not_accessible';

  await pool.query(
    `UPDATE locations SET average_rating=?, total_reviews=?, accessibility_status=? WHERE id=?`,
    [avg, total, status, locationId]
  );
};
```

### 📤 Output — Heatmap Data Endpoint

```js
// GET /api/locations/heatmap
// Returns [lat, lng, intensity] for Leaflet.heat
router.get('/locations/heatmap', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT lat, lng, average_rating as intensity FROM locations WHERE is_active = 1`
  );
  const points = rows.map(r => [r.lat, r.lng, r.intensity / 5]); // normalize 0-1
  res.json({ success: true, data: points });
});
```

---

### ▶️ Run the Full Pipeline (Step by Step)

This verifies the entire pipeline is working end-to-end:

```bash
# ── STEP 1: INGEST ──────────────────────────────────────────────
# Seed the database with sample locations, users, reviews
node src/utils/seed.js

# Expected output:
# ✅ MySQL Connected via Sequelize
# ✅ All tables synced
# 👥 Created 5 users
# 📍 Created 5 locations
# ⭐ Created 4 reviews
# ✅ Database seeded successfully!

# ── STEP 2: VERIFY STORAGE ──────────────────────────────────────
# Check data actually made it into MySQL
mysql -u root -p daleel -e "
  SELECT 'Users'     AS table_name, COUNT(*) AS count FROM users
  UNION SELECT 'Locations', COUNT(*) FROM locations
  UNION SELECT 'Reviews',   COUNT(*) FROM reviews;
"

# Expected output:
# +------------+-------+
# | table_name | count |
# +------------+-------+
# | Users      |     5 |
# | Locations  |     5 |
# | Reviews    |     4 |
# +------------+-------+

# ── STEP 3: START SERVER ────────────────────────────────────────
npm run dev
# Expected: 🚀 Daleel API running on port 5000

# ── STEP 4: PROCESS — test scoring logic ────────────────────────
# Submit a review → triggers score recalculation automatically
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@daleel.com","password":"password123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

echo "Token received ✅"

# ── STEP 5: OUTPUT — verify API returns processed data ──────────
curl -s http://localhost:5000/api/locations \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Locations returned: {len(d[\"data\"])} ✅')"

# GET heatmap data points
curl -s "http://localhost:5000/api/locations?limit=100" \
  | python3 -c "
import sys, json
d = json.load(sys.stdin)
pts = [[l['lat'], l['lng'], float(l['averageRating'] or 0)/5] for l in d['data']]
print(f'Heatmap points ready: {len(pts)} ✅')
print('Sample:', pts[0] if pts else 'none')
"
```

**Pipeline health summary:**

```
[OSM / Seed Data] ──► [MySQL daleel DB] ──► [Express API :5000] ──► [Frontend / Heatmap]
      ✅ ingest             ✅ stored             ✅ processed            ✅ output
```

---

## 📁 Project Structure

```
daleel-backend/
├── src/
│   ├── config/
│   │   ├── db.js              # MySQL pool (mysql2)
│   │   └── database.js        # Sequelize instance + sync
│   ├── controllers/
│   │   ├── authController.js  # Register, Login, Profile
│   │   ├── locationController.js
│   │   └── mainControllers.js # Reviews, Emergency, Support, Community, Admin
│   ├── middleware/
│   │   └── auth.js            # JWT protect, authorize, optionalAuth
│   ├── models/
│   │   ├── User.js
│   │   ├── Location.js
│   │   ├── Review.js
│   │   └── Other.js           # Notifications, Emergency, Tickets, Posts
│   ├── routes/
│   │   └── index.js           # All API routes
│   ├── utils/
│   │   └── seed.js            # Database seeder
│   └── server.js              # Express + Socket.IO entry point
├── uploads/                   # User uploaded photos
├── .env.example               # Environment variables template
├── package.json
└── README.md

frontend/  (HTML files — same folder)
├── welcome_and_onboarding_screen.html
├── login.html
├── user_registeration.html
├── regular_user_dashboard.html
├── business_owner_dashboard.html
├── Admin_dashboard.html
├── report_management.html
├── admin_users.html
├── admin_locations.html
├── admin_settings.html
├── interactive_map.html
├── location_details.html
├── emergency_assistance.html
└── ... (20+ pages)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MySQL 8 + MySQL Workbench
- Git

### 1. Clone the repository

```bash
git clone https://github.com/janahegazy/DALEEL.git
cd DALEEL/daleel-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

Open MySQL Workbench and run:

```sql
CREATE DATABASE daleel;
```

### 4. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=daleel
DB_PORT=3306
JWT_SECRET=your_super_secret_key
GROK_API_KEY=your_grok_api_key
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 5. Start the server

```bash
# Development (auto-restart)
npm run dev

# Seed sample data
npm run seed

# Production
npm start
```

### 6. Open the frontend

Open `welcome_and_onboarding_screen.html` in your browser, or serve the HTML files with a local server:

```bash
npx serve . -p 3000
```

### 7. Test the API

```bash
# Health check
curl http://localhost:5000/

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456","role":"regular_user"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

---

## 🔑 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `PORT` | Server port (default: 5000) | ✅ |
| `DB_HOST` | MySQL host | ✅ |
| `DB_USER` | MySQL username | ✅ |
| `DB_PASSWORD` | MySQL password | ✅ |
| `DB_NAME` | Database name (`daleel`) | ✅ |
| `DB_PORT` | MySQL port (default: 3306) | ✅ |
| `JWT_SECRET` | Secret key for JWT signing | ✅ |
| `JWT_EXPIRES_IN` | Token expiry (default: 7d) | ❌ |
| `GROK_API_KEY` | xAI Grok API key for AI features | ❌ |
| `FRONTEND_URL` | Frontend URL for CORS | ❌ |
| `NODE_ENV` | `development` or `production` | ❌ |

---

## 👥 Team

| Role | Responsibilities |
|---|---|
| **Full Stack Dev** | Backend API, Database, Frontend integration |
| **UI/UX Designer** | HTML pages, TailwindCSS styling |
| **AI Integration** | Grok API, recommendation engine |
| **Data Engineer** | OSM ingestion, pipeline, seed scripts |

---


<div align="center">
  <p>Built with ❤️ to make the world more accessible</p>
  <p><strong>Daleel — دليل</strong></p>
</div>
