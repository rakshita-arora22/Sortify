# Citizen Dashboard — Person 2 (Rakshita)

Covers tasks 1–5 from your task list. Task 6 (Tailwind theme sync) is on you
and Person 6 — see "Style consistency" below.

## Setup

1. Copy this whole `citizen-dashboard/` folder into your app (or merge
   `lib/` and `components/` into your existing `src/`).
2. `npm install firebase` if not already installed.
3. Drop `<CitizenDashboard />` into a route.

`lib/firebaseConfig.js`, `lib/constants.js`, `lib/firestoreHelpers.js` are
**copied unmodified** from Person 1's zip. Don't edit them locally — if you
need a change (e.g. a new helper), ask Soumya to update the shared files so
everyone stays in sync, then re-copy.

## ⚠️ Blocking issue — tell Soumya before you demo

`TEAM_SYNC_NOTES.md` says citizens now have fixed ids (`citizen-1`..
`citizen-8`) and a `segregationBreakdown` field. **The actual `seedData.js`
in this zip still does neither** — it uses `addDoc` (random ids) and only
writes flat `segregationScore`. Until she fixes and re-runs the seed script:

- `HomeOverview`, `SegregationScore`, and `RewardsStreak` will show their
  "couldn't load" / empty states, because `getCitizen("citizen-1")` returns
  `null`.
- `SegregationScore`'s per-category bars will show the "not available yet"
  message even once a citizen loads, because `segregationBreakdown` won't
  exist on the doc.

Nothing to fix on your end — this is a one-line seed script change on her
side. The components are already written to degrade gracefully rather than
crash, so you can keep building against them in the meantime.

## Assumptions I made (flag if the team wants different behavior)

- **Home "rank"** = citizen's position citywide sorted by `points`
  descending. Swap the metric string in `HomeOverview.jsx` (search for
  `computeRank`) to `"segregationScore"` if rank should reflect cleanliness
  instead of activity.
- **Leaderboard ranking** = society's *average* `segregationScore` across
  its members (rewards clean societies, not just big ones). Total `points`
  is tracked too if you'd rather rank by that — see `rankSocieties()` in
  `SocietyLeaderboard.jsx`.
- **Segregation color thresholds**: 🟢 ≥80%, 🟡 50–79%, 🔴 <50%. Centralized
  in `lib/segregationUtils.js` so Home, Segregation Score, and the
  Leaderboard all agree.
- **Point log** is the hardcoded sample list your task doc asked for — not
  read from Firestore. If the team later wants real activity history, that's
  a new subcollection Soumya would need to add.

## Style consistency (task 6)

Every component uses Tailwind utility classes only — no inline hex colors
except inside `lib/segregationUtils.js`'s `STATUS_CLASSES` map, which is
deliberately centralized so Person 6 can retune the palette (spacing,
border-radius, accent colors) in one place instead of hunting through five
files. Send them that file first.
