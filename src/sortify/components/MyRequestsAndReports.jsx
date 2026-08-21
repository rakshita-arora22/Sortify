// MyRequestsAndReports.jsx
// Person 3 (Hemakshi)
// Unified live list of the citizen's own pickupRequests + complaints, newest first.

import { useEffect, useState } from "react";
import { db } from "../lib/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { CURRENT_CITIZEN_ID } from "../lib/constants";

const STATUS_COLOR = {
  Requested: "#F2A93B",
  Collected: "#5FC9B4",
  Open: "#E4572E",
  Resolved: "#5FC9B4",
};

// timestamp comes back as a Firestore Timestamp (from serverTimestamp()),
// not a string — guard for the brief window right after a write, before the
// server timestamp has resolved locally (it's null on the optimistic update).
function toMillis(ts) {
  return ts?.toDate ? ts.toDate().getTime() : 0;
}

export default function MyRequestsAndReports() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let pickups = [];
    let complaints = [];

    function merge() {
      const combined = [...pickups, ...complaints].sort(
        (a, b) => toMillis(b.timestamp) - toMillis(a.timestamp)
      );
      setItems(combined);
    }

    const pickupQuery = query(collection(db, "pickupRequests"), where("citizenId", "==", CURRENT_CITIZEN_ID));
    const unsubPickups = onSnapshot(pickupQuery, (snap) => {
      pickups = snap.docs.map((d) => ({
        id: d.id,
        kind: "Pickup",
        title: d.data().wasteType,
        ...d.data(),
      }));
      merge();
    });

    const complaintQuery = query(collection(db, "complaints"), where("citizenId", "==", CURRENT_CITIZEN_ID));
    const unsubComplaints = onSnapshot(complaintQuery, (snap) => {
      complaints = snap.docs.map((d) => ({
        id: d.id,
        kind: "Complaint",
        title: d.data().issueType,
        ...d.data(),
      }));
      merge();
    });

    return () => {
      unsubPickups();
      unsubComplaints();
    };
  }, []);

  if (items.length === 0) {
    return <p style={{ color: "#888" }}>No requests or reports yet.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 14px",
            border: "1px solid #eee",
            borderRadius: 8,
          }}
        >
          <div>
            <div style={{ fontWeight: 600 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: "#888" }}>
              {item.kind} · {item.ward} · {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleDateString() : "just now"}
            </div>
          </div>
          <span
            style={{
              fontSize: 11,
              padding: "3px 10px",
              borderRadius: 999,
              color: "#fff",
              background: STATUS_COLOR[item.status] || "#999",
            }}
          >
            {item.status}
          </span>
        </div>
      ))}
    </div>
  );
}
