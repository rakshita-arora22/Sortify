import { useState, useEffect } from "react";
import { subscribeToBins } from "../lib/firestoreHelpers";

function fillStatus(fillLevel) {
  if (fillLevel >= 80) return { emoji: "🔴", label: "Overflowing", classes: "bg-rose-50 text-rose-700" };
  if (fillLevel >= 50) return { emoji: "🟠", label: "Near capacity", classes: "bg-amber-50 text-amber-700" };
  return { emoji: "🟢", label: "Normal", classes: "bg-emerald-50 text-emerald-700" };
}

export default function BinStatusList() {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const unsub = subscribeToBins((data) => {
      setBins([...data].sort((a, b) => (b.fillLevel ?? 0) - (a.fillLevel ?? 0)));
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm animate-pulse h-64" />;
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Bin Status</h2>
      <ul className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
        {bins.map((bin) => {
          const status = fillStatus(bin.fillLevel ?? 0);
          const expanded = expandedId === bin.id;
          return (
            <li key={bin.id} className="py-3">
              <button
                onClick={() => setExpandedId(expanded ? null : bin.id)}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{status.emoji} {bin.location}</p>
                  <p className="text-xs text-slate-400">{bin.ward} · {bin.wasteType}</p>
                </div>
                <span className={`text-xs font-semibold rounded-full px-2 py-1 ${status.classes}`}>
                  {bin.fillLevel}%
                </span>
              </button>
              {expanded && (
                <div className="mt-2 ml-1 text-xs text-slate-500 space-y-1 bg-slate-50 rounded-lg p-3">
                  <p>Status: {status.label}</p>
                  <p>Priority: {bin.priority ?? "–"}</p>
                  <p>
                    Last collected:{" "}
                    {bin.lastCollected?.toDate ? bin.lastCollected.toDate().toLocaleString() : "–"}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
