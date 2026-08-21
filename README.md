# Sortify — Smart City Waste Management Ecosystem

An end-to-end waste management platform connecting **Citizens**, **Collection Crews**, and **Municipal Authorities** through one shared, real-time data layer — built for SPECTRA 2026 (Problem Statement 1: Smart City).

## The Problem

Urban waste management fails at three connected points:

1. **Source Segregation Failure** — citizens lack awareness and incentive to segregate waste at home.
2. **Lack of Citizen Engagement** — no feedback loop rewards good segregation behavior.
3. **Inefficient Collection Logistics** — trucks run fixed, fuel-heavy routes regardless of actual waste volume or urgency.

These aren't independent problems. Poor segregation makes collection less efficient, and inefficient collection removes any visible incentive for citizens to bother segregating in the first place.

## The Solution

Sortify treats these as one connected system instead of three separate features, built around a **closed feedback loop**:

```
Citizen scans/reports → AI classifies → Segregation logged
        ↓
Ready for Pickup → Crew sees live request
        ↓
Crew collects + verifies segregation
        ↓
Data flows to Municipal dashboard
        ↓
Anomaly detection flags problem wards
        ↓
Targeted intervention flagged
        ↓
Citizen behavior improves → cycle repeats
```

All three dashboards read and write to the same Firestore backend in real time — a pickup request submitted on the Citizen dashboard appears on the Crew dashboard instantly, with no manual refresh.

## Features

### 👤 Citizen Dashboard
- **Waste Scanner** — photo upload classified via Hugging Face's Recycling-Net-11 model, mapped to a bin recommendation
- **Segregation Score** — overall % plus a Wet/Dry/Recyclable/Hazardous breakdown
- **Rewards + Streak** — points, current streak, recent activity log
- **Society Leaderboard** — top societies + the citizen's own ranking
- **Ready for Pickup** — submit a pickup request, visible live on the Crew dashboard
- **Report Issue** — flag overflowing bins, missed collection, improper segregation, or illegal dumping
- **My Requests & Reports** — unified status view of the citizen's own submissions
- **Disposal Guide** — searchable lookup for how to dispose of common items

### 🚛 Crew Dashboard
- **Smart Route Optimization** — weighted priority scoring (fill level, waste type, distance from depot) + nearest-neighbor route ordering, with a live Fixed-Route-vs-Smart-Route distance comparison
- **Bin Status** — fill % with color-coded status and click-through detail
- **Pending Pickup Requests** — live feed with one-tap "Mark as Collected"
- **Segregation Check** — per-bin ✅ Properly Segregated / ❌ Mixed Waste toggle with a reason field
- **Today's Progress** — live completed-vs-total counter
- **Complaints List** — Open → Resolved workflow, shared with Municipal

### 🏛️ Municipal Dashboard
- **City Overview** — compliance %, critical bin count, active crews, distance saved %, waste diverted
- **Anomaly Detection** — threshold-based alerts (e.g. a ward's compliance dropping below target) with a suggested action
- **Ward Watchlist** — per-ward compliance, contamination, and overflow tracking
- **Route Efficiency** & **Fuel/CO₂ Savings** — city-scale view of the same route optimization data Crew sees
- **Ward Leaderboard** — top-performing wards by compliance

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite, React Router |
| Styling | Tailwind CSS v4 |
| Backend / Data | Firebase Firestore (real-time listeners, no separate backend server) |
| AI | Hugging Face Inference API — Recycling-Net-11 waste classifier |
| Charts / Icons | Recharts, Lucide React |

## Data Model

Five Firestore collections, all keyed off a single locked naming convention (`src/sortify/lib/constants.js`) so ward and society names never drift out of sync across dashboards:

- **`bins`** — location, ward, fillLevel, wasteType, lat/lng, priority, segregationCheck
- **`pickupRequests`** — citizenId, wasteType, quantity, ward, status, lat/lng
- **`complaints`** — citizenId, issueType, ward, status
- **`citizens`** — name, society, ward, points, streak, segregationScore, segregationBreakdown
- **`cityStats`** — single document (`current`) with city-wide aggregate stats

There's no real login system in this build — every dashboard reads a fixed demo citizen (`CURRENT_CITIZEN_ID` in `constants.js`) in place of authentication.

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set up Firebase
# - Create a Firebase project with Firestore enabled
# - Copy your config into src/sortify/lib/firebaseConfig.js
# - Publish the security rules (test-mode/open rules are fine for local dev)

# 3. Seed mock data (bins, citizens, pickup requests, complaints)
node scripts/seedData.cjs

# 4. Run the dev server
npm run dev
```

Then visit `http://localhost:5173` and pick a role — Citizen, Crew, or Municipal.

## Known Limitations & Roadmap

Built in a time-boxed hackathon, so a few pieces are intentionally simulated rather than production-ready:

- **Bin fill levels are simulated**, not from real IoT sensors — swapping in ultrasonic fill sensors wouldn't require changing the routing algorithm itself.
- **No real authentication** — Firestore rules are open for demo purposes; production needs Firebase Auth and role-scoped security rules.
- **Route optimization uses nearest-neighbor heuristic** with straight-line distance — a real deployment would use road-network routing and a proper multi-vehicle solver.
- **Anomaly detection uses fixed thresholds** rather than statistical baselines.
- **Reward points are simulated**, with no real redemption mechanism yet.

## Team

| Role | Owner |
|---|---|
| Backend / Data Lead | Soumya |
| Citizen Dashboard (Core) | Rakshita |
| Citizen Dashboard (AI + Requests) | Hemakshi |
| Crew Dashboard | Stuti |
| Municipal Dashboard | Mehek |
| Shared Infrastructure, Map & Deploy | Shreya |
