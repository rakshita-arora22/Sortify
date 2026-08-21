// 🔒 LOCKED NAMING CONVENTION
// Agreed at the 0:20 team sync. Import this file everywhere (Citizen, Crew, Municipal
// dashboards) instead of hardcoding ward/society strings. This is what makes the
// leaderboard, ward table, watchlist, and anomaly detection line up correctly.
//
// Rule for the team: if you ever need a new ward or society, add it here first,
// then message the group. Never type a ward/society name by hand in a component.

export const WARDS = ["Ward 1", "Ward 2", "Ward 3", "Ward 4"];

export const SOCIETIES = [
  { name: "Green Valley Society", ward: "Ward 1" },
  { name: "Lakeview Apartments", ward: "Ward 1" },
  { name: "Sunrise Enclave", ward: "Ward 2" },
  { name: "Palm Residency", ward: "Ward 2" },
  { name: "Hilltop Homes", ward: "Ward 3" },
  { name: "Riverside Colony", ward: "Ward 3" },
  { name: "Maple Heights", ward: "Ward 4" },
  { name: "Oakwood Society", ward: "Ward 4" },
];

export const WASTE_TYPES = ["wet", "dry", "recyclable", "hazardous", "e-waste"];

export const PICKUP_STATUS = { REQUESTED: "Requested", COLLECTED: "Collected" };

export const COMPLAINT_STATUS = { OPEN: "Open", RESOLVED: "Resolved" };

export const ISSUE_TYPES = [
  "Overflowing bin",
  "Not collected",
  "Improper segregation",
  "Illegal dumping",
];

// 🔒 DEMO LOGIN STAND-IN — no Firebase Auth this hackathon, so every
// dashboard hardcodes this as "the current citizen" instead of a real login.
// Import this everywhere you'd otherwise need a logged-in user's id. If the
// team wants to demo as someone else, change it ONLY here.
export const CURRENT_CITIZEN_ID = "citizen-1";

// The 4 categories the Citizen dashboard's Segregation Score breakdown uses.
// Subset of WASTE_TYPES — e-waste is tracked at the bin/pickup level but
// isn't part of the personal segregation score.
export const SEGREGATION_CATEGORIES = ["wet", "dry", "recyclable", "hazardous"];
