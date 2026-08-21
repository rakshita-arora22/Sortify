import { useEffect, useState } from "react";
import { subscribeToBins, setSegregationCheck } from "../lib/firestoreHelpers";

export default function SegregationCheck() {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToBins((data) => {
      setBins(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  async function handleCheck(binId, segregated) {
    await setSegregationCheck(binId, {
      segregated,
      reason: segregated ? "" : "Mixed waste found",
    });
  }

  if (loading) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm animate-pulse h-56" />;
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Segregation Check</h2>
      <ul className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
        {bins.map((bin) => {
          const check = bin.segregationCheck;
          return (
            <li key={bin.id} className="py-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-800">{bin.location}</p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleCheck(bin.id, true)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                      check?.segregated === true ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    ✅ Segregated
                  </button>
                  <button
                    onClick={() => handleCheck(bin.id, false)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                      check?.segregated === false ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    ❌ Mixed
                  </button>
                </div>
              </div>
              {check?.segregated === false && (
                <input
                  type="text"
                  placeholder="Reason (e.g. plastic in wet bin)"
                  defaultValue={check.reason}
                  onBlur={(e) => setSegregationCheck(bin.id, { segregated: false, reason: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
