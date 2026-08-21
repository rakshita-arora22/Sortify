// Shared thresholds so every component (Home, Segregation Score, Leaderboard)
// agrees on what counts as good/ok/poor segregation. Change the numbers here,
// not in individual components.

export function getSegregationStatus(score) {
  if (score == null) return { emoji: "⚪", color: "gray", label: "No data" };
  if (score >= 80) return { emoji: "🟢", color: "green", label: "Good" };
  if (score >= 50) return { emoji: "🟡", color: "yellow", label: "Needs work" };
  return { emoji: "🔴", color: "red", label: "Poor" };
}

// Tailwind classes per status color, kept in one place so Person 6 can retune
// the palette later without touching every component.
export const STATUS_CLASSES = {
  green: { bg: "bg-emerald-50", bar: "bg-emerald-500", text: "text-emerald-700", ring: "ring-emerald-200" },
  yellow: { bg: "bg-amber-50", bar: "bg-amber-500", text: "text-amber-700", ring: "ring-amber-200" },
  red: { bg: "bg-rose-50", bar: "bg-rose-500", text: "text-rose-700", ring: "ring-rose-200" },
  gray: { bg: "bg-slate-50", bar: "bg-slate-300", text: "text-slate-500", ring: "ring-slate-200" },
};

const CATEGORY_LABELS = {
  wet: "Wet",
  dry: "Dry",
  recyclable: "Recyclable",
  hazardous: "Hazardous",
};

export function categoryLabel(key) {
  return CATEGORY_LABELS[key] || key;
}
