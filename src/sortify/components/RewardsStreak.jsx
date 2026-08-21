import { useCurrentCitizen } from "../lib/useCurrentCitizen";

// Per the task brief, the recent point log is a hardcoded sample — it's not
// meant to come from Firestore. If the team later wants a real activity
// feed, this is where a `pointLog` subcollection read would replace the
// array below.
const SAMPLE_POINT_LOG = [
  { label: "+20 Correct segregation", when: "Today" },
  { label: "+50 E-waste drive", when: "2 days ago" },
  { label: "+10 On-time pickup", when: "3 days ago" },
  { label: "+15 Correct segregation", when: "5 days ago" },
  { label: "-5 Missed pickup", when: "1 week ago" },
];

export default function RewardsStreak() {
  const { citizen, loading } = useCurrentCitizen();

  if (loading) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm animate-pulse h-48" />;
  }
  if (!citizen) return null;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-xl bg-indigo-50 p-4">
          <p className="text-xs text-slate-500">Total points</p>
          <p className="text-2xl font-bold text-indigo-700">{citizen.points ?? 0}</p>
        </div>
        <div className="rounded-xl bg-orange-50 p-4">
          <p className="text-xs text-slate-500">Current streak</p>
          <p className="text-2xl font-bold text-orange-700">
            🔥 {citizen.streak ?? 0} <span className="text-sm font-normal">days</span>
          </p>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-slate-700 mb-2">Recent activity</h3>
      <ul className="divide-y divide-slate-100">
        {SAMPLE_POINT_LOG.map((entry, i) => (
          <li key={i} className="flex justify-between py-2 text-sm">
            <span className={entry.label.startsWith("-") ? "text-rose-600" : "text-slate-700"}>
              {entry.label}
            </span>
            <span className="text-slate-400">{entry.when}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
