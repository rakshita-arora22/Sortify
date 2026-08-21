import { useState } from "react";
import { ArrowUp, ArrowDown, Flag } from "lucide-react";
import ComplianceGauge from "./ComplianceGauge";

function WardCard({ w }) {
  // Non-functional per MVP scope — UI-only toggle, no Firestore write.
  const [flagged, setFlagged] = useState(false);
  const TrendIcon = w.trend.direction === "up" ? ArrowUp : ArrowDown;
  const trendColor = w.trend.direction === "up" ? "text-teal" : "text-red";

  return (
    <div className="panel p-4 flex flex-col items-center gap-3">
      <div className="w-full flex items-center justify-between">
        <span className="font-display text-sm font-medium text-ink">{w.ward}</span>
        <span className={`flex items-center gap-0.5 text-xs font-mono ${trendColor}`}>
          <TrendIcon size={12} />
          {w.trend.magnitude}pt
        </span>
      </div>

      <ComplianceGauge value={w.compliance} size="sm" />

      <div className="w-full grid grid-cols-2 gap-2 text-center">
        <div className="rounded-lg bg-panel2 border border-line py-2">
          <p className="text-[10px] font-mono uppercase text-mist">Contamination</p>
          <p className="text-sm font-mono text-amber">{w.contamination}%</p>
        </div>
        <div className="rounded-lg bg-panel2 border border-line py-2">
          <p className="text-[10px] font-mono uppercase text-mist">Overflow</p>
          <p className="text-sm font-mono text-red">{w.overflowCount}</p>
        </div>
      </div>

      <button
        onClick={() => setFlagged((f) => !f)}
        className={`w-full flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-colors ${
          flagged
            ? "border-amber/50 bg-amber/10 text-amber"
            : "border-line text-mist hover:text-ink hover:border-mist/50"
        }`}
      >
        <Flag size={13} />
        {flagged ? "Flagged for intervention" : "Flag for intervention"}
      </button>
    </div>
  );
}

export default function WardWatchlist({ wardStats }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="eyebrow">Ward Watchlist</h2>
        <span className="text-xs font-mono text-mist">simulated trend vs last week</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {wardStats.map((w) => (
          <WardCard key={w.ward} w={w} />
        ))}
      </div>
    </div>
  );
}
