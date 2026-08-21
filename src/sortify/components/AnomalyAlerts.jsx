import { AlertOctagon, AlertTriangle, CheckCircle2 } from "lucide-react";

const SEVERITY = {
  critical: {
    icon: AlertOctagon,
    border: "border-red/40",
    bg: "bg-red/[0.06]",
    text: "text-red",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-amber/40",
    bg: "bg-amber/[0.06]",
    text: "text-amber",
  },
};

export default function AnomalyAlerts({ anomalies }) {
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="eyebrow">Anomaly Detection</h2>
        <span className="text-xs font-mono text-mist">{anomalies.length} active</span>
      </div>

      {anomalies.length === 0 ? (
        <div className="flex items-center gap-2 text-mist text-sm py-6 justify-center">
          <CheckCircle2 size={16} className="text-teal" />
          No threshold breaches detected across any ward.
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {anomalies.map((a) => {
            const cfg = SEVERITY[a.severity];
            const Icon = cfg.icon;
            return (
              <li
                key={a.id}
                className={`rounded-lg border ${cfg.border} ${cfg.bg} p-3.5`}
              >
                <div className="flex gap-2.5">
                  <Icon size={16} className={`${cfg.text} shrink-0 mt-0.5`} strokeWidth={1.75} />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-ink leading-snug">{a.message}</p>
                    <p className="text-xs text-mist leading-snug">
                      Suggested: {a.suggestedAction}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
