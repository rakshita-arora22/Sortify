import { useEffect, useState } from "react";
import { subscribeToPickupRequests } from "../lib/firestoreHelpers";
import { PICKUP_STATUS } from "../lib/constants";

export default function TodaysProgress() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToPickupRequests((data) => {
      setRequests(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm animate-pulse h-20" />;
  }

  const total = requests.length;
  const completed = requests.filter((r) => r.status === PICKUP_STATUS.COLLECTED).length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-xs text-slate-500 mb-1">Today's Progress</p>
      <p className="text-2xl font-bold text-slate-900 mb-2">{completed} / {total} completed</p>
      <div className="h-2 w-full rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
