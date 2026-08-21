// Radial gauge, styled like a physical meter rather than a flat progress
// bar or a default recharts donut — this dashboard's signature visual motif,
// reused at two sizes (city-level headline stat, per-ward watchlist cards).
const SIZE_CONFIG = {
  lg: { box: 128, stroke: 10, radius: 52, font: "text-2xl" },
  sm: { box: 88, stroke: 7, radius: 36, font: "text-lg" },
};

function toneColor(value) {
  if (value >= 80) return "#22C3A6"; // teal
  if (value >= 60) return "#F2A93B"; // amber
  return "#F0575A"; // red
}

export default function ComplianceGauge({ value = 0, label, size = "lg" }) {
  const cfg = SIZE_CONFIG[size];
  const center = cfg.box / 2;
  const circumference = 2 * Math.PI * cfg.radius;
  // Gauge sweeps 270° (like a speedometer), starting at -225deg
  const sweep = 0.75;
  const arcLength = circumference * sweep;
  const filled = arcLength * (Math.min(100, Math.max(0, value)) / 100);
  const color = toneColor(value);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: cfg.box, height: cfg.box }}>
        <svg
          width={cfg.box}
          height={cfg.box}
          viewBox={`0 0 ${cfg.box} ${cfg.box}`}
          className="-rotate-[225deg]"
        >
          <circle
            cx={center}
            cy={center}
            r={cfg.radius}
            fill="none"
            stroke="#232E45"
            strokeWidth={cfg.stroke}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          <circle
            cx={center}
            cy={center}
            r={cfg.radius}
            fill="none"
            stroke={color}
            strokeWidth={cfg.stroke}
            strokeDasharray={`${filled} ${circumference}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-mono font-semibold ${cfg.font}`} style={{ color }}>
            {Math.round(value)}%
          </span>
        </div>
      </div>
      {label && <span className="eyebrow text-center">{label}</span>}
    </div>
  );
}
