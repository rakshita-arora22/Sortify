import { useCurrentCitizen } from "../lib/useCurrentCitizen";
import { SEGREGATION_CATEGORIES } from "../lib/constants";
import { getSegregationStatus, STATUS_CLASSES, categoryLabel } from "../lib/segregationUtils";

function CategoryBar({ label, score }) {
  const status = getSegregationStatus(score);
  const classes = STATUS_CLASSES[status.color];
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600">
          {status.emoji} {label}
        </span>
        <span className={`font-medium ${classes.text}`}>{score != null ? `${score}%` : "–"}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full ${classes.bar}`}
          style={{ width: `${score ?? 0}%` }}
        />
      </div>
    </div>
  );
}

export default function SegregationScore() {
  const { citizen, loading } = useCurrentCitizen();

  if (loading) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm animate-pulse h-40" />;
  }
  if (!citizen) return null;

  const overall = getSegregationStatus(citizen.segregationScore);
  const overallClasses = STATUS_CLASSES[overall.color];
  const breakdown = citizen.segregationBreakdown;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Segregation Score</h2>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${overallClasses.bg} ${overallClasses.text}`}>
          {overall.emoji} {citizen.segregationScore ?? "–"}%
        </span>
      </div>

      {breakdown ? (
        <div className="space-y-3">
          {SEGREGATION_CATEGORIES.map((key) => (
            <CategoryBar key={key} label={categoryLabel(key)} score={breakdown[key]} />
          ))}
        </div>
      ) : (
        // segregationBreakdown isn't on the citizen doc yet — seedData.js
        // hasn't been updated to write it (see TEAM_SYNC_NOTES.md vs actual
        // seed script). Show an honest empty state instead of fake numbers.
        <p className="text-sm text-slate-400 italic">
          Per-category breakdown isn't available yet — waiting on the backend
          to seed `segregationBreakdown` for this citizen.
        </p>
      )}
    </div>
  );
}
