import { useEffect, useState } from "react";
import { subscribeToPickupRequests, markCollected } from "../lib/firestoreHelpers";
import { PICKUP_STATUS } from "../lib/constants";

export default function PendingPickupRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collectingId, setCollectingId] = useState(null);

  useEffect(() => {
    const unsub = subscribeToPickupRequests((data) => {
      setRequests(data);
      setLoading(false);
    }, PICKUP_STATUS.REQUESTED);
    return unsub;
  }, []);

  async function handleCollect(id) {
    setCollectingId(id);
    try {
      await markCollected(id);
    } finally {
      setCollectingId(null);
    }
  }

  if (loading) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm animate-pulse h-56" />;
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Pending Pickup Requests</h2>
      {requests.length === 0 ? (
        <p className="text-sm text-slate-400">No pending requests right now.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {requests.map((r) => (
            <li key={r.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-800 capitalize">{r.wasteType}</p>
                <p className="text-xs text-slate-400">{r.quantity} · {r.ward}</p>
              </div>
              <button
                onClick={() => handleCollect(r.id)}
                disabled={collectingId === r.id}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {collectingId === r.id ? "…" : "Mark Collected"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
