import { useCurrentCitizen } from "../lib/useCurrentCitizen";
import { useAllCitizens } from "../lib/useAllCitizens";
import { SOCIETIES } from "../lib/constants";

// Ranks societies by average segregationScore across their citizens (i.e.
// which society segregates waste best) — swap to summed `points` if the
// team decides the leaderboard should reward overall activity instead.
function rankSocieties(citizens) {
  const bySociety = new Map(SOCIETIES.map((s) => [s.name, { ...s, scores: [], points: 0 }]));

  for (const c of citizens) {
    const entry = bySociety.get(c.society);
    if (!entry) continue; // citizen has a society not in constants.js — skip rather than crash
    if (c.segregationScore != null) entry.scores.push(c.segregationScore);
    entry.points += c.points ?? 0;
  }

  return [...bySociety.values()]
    .map((s) => ({
      ...s,
      avgScore: s.scores.length ? Math.round(s.scores.reduce((a, b) => a + b, 0) / s.scores.length) : null,
      members: s.scores.length,
    }))
    .filter((s) => s.members > 0)
    .sort((a, b) => (b.avgScore ?? -1) - (a.avgScore ?? -1));
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function SocietyLeaderboard() {
  const { citizen } = useCurrentCitizen();
  const { citizens, loading } = useAllCitizens();

  if (loading) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm animate-pulse h-56" />;
  }

  const ranked = rankSocieties(citizens);
  const top3 = ranked.slice(0, 3);
  const ownRank = citizen ? ranked.findIndex((s) => s.name === citizen.society) + 1 : null;
  const ownEntry = citizen ? ranked.find((s) => s.name === citizen.society) : null;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Society Leaderboard</h2>

      <ul className="space-y-2">
        {top3.map((s, i) => (
          <li
            key={s.name}
            className={`flex items-center justify-between rounded-xl p-3 ${
              citizen && s.name === citizen.society ? "bg-indigo-50 ring-1 ring-indigo-200" : "bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{MEDALS[i]}</span>
              <div>
                <p className="text-sm font-medium text-slate-800">{s.name}</p>
                <p className="text-xs text-slate-400">{s.ward} · {s.members} members</p>
              </div>
            </div>
            <span className="text-sm font-bold text-emerald-600">{s.avgScore}%</span>
          </li>
        ))}
      </ul>

      {citizen && ownRank && ownRank > 3 && ownEntry && (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-indigo-50 ring-1 ring-indigo-200 p-3">
          <div>
            <p className="text-sm font-medium text-slate-800">#{ownRank} {ownEntry.name} (yours)</p>
            <p className="text-xs text-slate-400">{ownEntry.ward} · {ownEntry.members} members</p>
          </div>
          <span className="text-sm font-bold text-emerald-600">{ownEntry.avgScore}%</span>
        </div>
      )}
    </div>
  );
}
