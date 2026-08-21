import { useCurrentCitizen } from "../lib/useCurrentCitizen";
import { useAllCitizens, computeRank } from "../lib/useAllCitizens";
import { getSegregationStatus, STATUS_CLASSES } from "../lib/segregationUtils";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeOverview() {
  const { citizen, loading, error } = useCurrentCitizen();
  const { citizens } = useAllCitizens();

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm animate-pulse">
        <div className="h-4 w-32 bg-slate-200 rounded mb-4" />
        <div className="h-8 w-48 bg-slate-200 rounded" />
      </div>
    );
  }

  if (!citizen) {
    return (
      <div className="rounded-2xl bg-rose-50 p-6 text-rose-700 text-sm">
        Couldn't load your profile. {error}
      </div>
    );
  }

  const status = getSegregationStatus(citizen.segregationScore);
  const classes = STATUS_CLASSES[status.color];
  // Rank citywide by points. Swap metric to "segregationScore" if the team
  // decides rank should reflect cleanliness rather than activity.
  const { rank, total } = computeRank(citizens, citizen.id, "points");

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{greeting()},</p>
      <h1 className="text-2xl font-semibold text-slate-900">{citizen.name} 👋</h1>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className={`rounded-xl p-4 ${classes.bg}`}>
          <p className="text-xs text-slate-500">Waste score</p>
          <p className={`text-xl font-bold ${classes.text}`}>
            {status.emoji} {citizen.segregationScore ?? "–"}%
          </p>
        </div>
        <div className="rounded-xl p-4 bg-indigo-50">
          <p className="text-xs text-slate-500">Points</p>
          <p className="text-xl font-bold text-indigo-700">{citizen.points ?? 0}</p>
        </div>
        <div className="rounded-xl p-4 bg-orange-50">
          <p className="text-xs text-slate-500">City rank</p>
          <p className="text-xl font-bold text-orange-700">
            {rank ? `#${rank}` : "–"}
            {total ? <span className="text-xs font-normal text-slate-400"> /{total}</span> : null}
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400">
        {citizen.society} · {citizen.ward}
      </p>
    </div>
  );
}
