import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  setDoc,
  increment,
  serverTimestamp,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { PICKUP_STATUS, COMPLAINT_STATUS } from "./constants";

// =====================================================
// WRITE HELPERS — the 6 functions everyone builds on top of
// =====================================================

// Citizen dashboard: "Ready for Pickup" submit
export async function addPickupRequest({ citizenId, wasteType, quantity, ward }) {
  const ref = await addDoc(collection(db, "pickupRequests"), {
    citizenId,
    wasteType,
    quantity,
    ward,
    status: PICKUP_STATUS.REQUESTED,
    timestamp: serverTimestamp(),
  });
  return ref.id;
}

// Citizen dashboard: "Report Issue"
export async function reportComplaint({ citizenId, issueType, ward }) {
  const ref = await addDoc(collection(db, "complaints"), {
    citizenId,
    issueType,
    ward,
    status: COMPLAINT_STATUS.OPEN,
    timestamp: serverTimestamp(),
  });
  return ref.id;
}

// Crew dashboard: "Mark as Collected" one-tap action
// Updates the request AND nudges the city-wide counter Municipal reads.
export async function markCollected(requestId) {
  await updateDoc(doc(db, "pickupRequests", requestId), {
    status: PICKUP_STATUS.COLLECTED,
    collectedAt: serverTimestamp(),
  });
  await updateDoc(doc(db, "cityStats", "current"), {
    totalCollectedToday: increment(1),
  });
}

// Crew/Municipal: resolve a citizen-reported complaint
export async function resolveComplaint(complaintId) {
  await updateDoc(doc(db, "complaints", complaintId), {
    status: COMPLAINT_STATUS.RESOLVED,
    resolvedAt: serverTimestamp(),
  });
}

// Simulated bin fill-level ticking (or Crew QR check-in updates)
export async function updateBinFillLevel(binId, fillLevel) {
  await updateDoc(doc(db, "bins", binId), {
    fillLevel,
    priority: fillLevel >= 80 ? "high" : fillLevel >= 50 ? "medium" : "low",
    lastUpdated: serverTimestamp(),
  });
}

// Citizen dashboard: Home / Rewards / Segregation Score screens.
// citizenId should be CURRENT_CITIZEN_ID from constants.js — there's no
// Firebase Auth this hackathon, so every dashboard reads the same fixed
// demo citizen instead of a real logged-in user.
export async function getCitizen(citizenId) {
  const snap = await getDoc(doc(db, "citizens", citizenId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export function subscribeToCitizen(citizenId, callback) {
  return onSnapshot(doc(db, "citizens", citizenId), (snap) =>
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null)
  );
}

// Municipal dashboard: City Overview stat cards
export async function getCityStats() {
  const snap = await getDoc(doc(db, "cityStats", "current"));
  return snap.exists() ? snap.data() : null;
}

// =====================================================
// BONUS — realtime listeners so Crew/Municipal dashboards update live
// without anyone having to write their own onSnapshot boilerplate.
// Each returns an unsubscribe function — call it in your component's cleanup.
// =====================================================

export function subscribeToBins(callback) {
  return onSnapshot(collection(db, "bins"), (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}

export function subscribeToPickupRequests(callback, onlyStatus) {
  const ref = collection(db, "pickupRequests");
  const q = onlyStatus ? query(ref, where("status", "==", onlyStatus)) : ref;
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}

export function subscribeToComplaints(callback, onlyStatus) {
  const ref = collection(db, "complaints");
  const q = onlyStatus ? query(ref, where("status", "==", onlyStatus)) : ref;
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}

// Helper for Firestore Security Rules / first-time collection creation:
// calling setDoc directly with merge is safer than addDoc when you want a
// known, fixed document id (used once by seedData.js for cityStats/current).
export async function initCityStats(initial) {
  await setDoc(doc(db, "cityStats", "current"), initial, { merge: true });
}
