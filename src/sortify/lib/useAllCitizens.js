import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";

// No subscribeToCitizens() helper exists in firestoreHelpers.js (Person 1
// only wrote listeners for bins/pickups/complaints), so this reads the
// collection directly the same way those helpers do. Used by the
// Leaderboard and by rank calculations on the Home screen.
export function useAllCitizens() {
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "citizens"), (snap) => {
      setCitizens(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { citizens, loading };
}

// Rank of `citizenId` among all citizens, sorted by `metric` descending.
// Returns { rank, total } — rank is 1-based, or null if citizenId isn't found.
export function computeRank(citizens, citizenId, metric = "points") {
  if (!citizens.length) return { rank: null, total: 0 };
  const sorted = [...citizens].sort((a, b) => (b[metric] ?? 0) - (a[metric] ?? 0));
  const index = sorted.findIndex((c) => c.id === citizenId);
  return { rank: index === -1 ? null : index + 1, total: sorted.length };
}
