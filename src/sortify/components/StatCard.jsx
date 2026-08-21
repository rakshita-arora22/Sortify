export default function StatCard({ icon: Icon, label, value, unit, tone = "civic" }) {
  const toneClasses = {
    civic: "text-civic",
    teal: "text-teal",
    amber: "text-amber",
    red: "text-red",
  };

  return (
    <div className="panel p-5 flex flex-col gap-3 min-w-[160px]">
      <div className="flex items-center justify-between">
        <span className="eyebrow">{label}</span>
        {Icon && <Icon size={16} className={toneClasses[tone]} strokeWidth={1.75} />}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={`stat-value text-3xl ${toneClasses[tone]}`}>{value}</span>
        {unit && <span className="text-sm text-mist font-mono">{unit}</span>}
      </div>
    </div>
  );
}
