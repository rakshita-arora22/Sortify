import { Trophy } from "lucide-react";

const RANK_COLOR = ["text-amber", "text-mist", "text-mist"];

export default function WardLeaderboard({ wardStats }) {
  const ranked = [...wardStats].sort((a, b) => b.compliance - a.compliance);

  return (
    <div className="panel p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={15} className="text-amber" />
        <h2 className="eyebrow">Ward Leaderboard</h2>
      </div>
      <ul className="flex flex-col gap-2">
        {ranked.map((w, i) => (
          <li
            key={w.ward}
            className="flex items-center justify-between rounded-lg bg-panel2 border border-line px-3.5 py-2.5"
          >
            <div className="flex items-center gap-3">
              <span className={`font-mono text-sm w-4 ${RANK_COLOR[i] || "text-mist"}`}>
                {i + 1}
              </span>
              <span className="text-sm text-ink">{w.ward}</span>
            </div>
            <span className="font-mono text-sm text-teal">{w.compliance}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
