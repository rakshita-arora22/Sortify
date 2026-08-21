import { useEffect, useState } from "react";
import { subscribeToComplaints, resolveComplaint } from "../lib/firestoreHelpers";
import { COMPLAINT_STATUS } from "../lib/constants";

export default function ComplaintsList() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);

  useEffect(() => {
    const unsub = subscribeToComplaints((data) => {
      setComplaints(data);
      setLoading(false);
    }, COMPLAINT_STATUS.OPEN);
    return unsub;
  }, []);

  async function handleResolve(id) {
    setResolvingId(id);
    try {
      await resolveComplaint(id);
    } finally {
      setResolvingId(null);
    }
  }

  if (loading) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm animate-pulse h-56" />;
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Complaints</h2>
      {complaints.length === 0 ? (
        <p className="text-sm text-slate-400">No open complaints.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {complaints.map((c) => (
            <li key={c.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-800">{c.issueType}</p>
                <p className="text-xs text-slate-400">{c.ward}</p>
              </div>
              <button
                onClick={() => handleResolve(c.id)}
                disabled={resolvingId === c.id}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {resolvingId === c.id ? "…" : "Resolve"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
