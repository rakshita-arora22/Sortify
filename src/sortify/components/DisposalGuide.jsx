import { useState } from "react";
import { DISPOSAL_GUIDE } from "../data/disposalGuide";
import { STATUS_CLASSES } from "../lib/segregationUtils";

// Static lookup — no Firestore involved. Purely local search over the
// predefined item list.
const CATEGORY_COLOR = {
  wet: "green",
  dry: "yellow",
  recyclable: "green",
  hazardous: "red",
};

export default function DisposalGuide() {
  const [query, setQuery] = useState("");

  const results = DISPOSAL_GUIDE.filter((entry) =>
    entry.item.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-3">Disposal Guide</h2>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search an item, e.g. 'battery'"
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />

      <ul className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
        {results.map((entry) => {
          const classes = STATUS_CLASSES[CATEGORY_COLOR[entry.category] || "gray"];
          return (
            <li key={entry.item} className="py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-800">{entry.item}</span>
                <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${classes.bg} ${classes.text}`}>
                  {entry.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{entry.tip}</p>
            </li>
          );
        })}
        {results.length === 0 && (
          <li className="py-6 text-center text-sm text-slate-400">No items match "{query}"</li>
        )}
      </ul>
    </div>
  );
}
