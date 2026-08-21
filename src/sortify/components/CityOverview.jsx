import { ShieldCheck, TriangleAlert, Truck, Route, Package } from "lucide-react";
import StatCard from "./StatCard";

export default function CityOverview({ cityStats, cityCompliance, criticalBinCount }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-teal pulse-dot" />
        <h2 className="eyebrow">City Overview — live</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard
          icon={ShieldCheck}
          label="Segregation Compliance"
          value={cityCompliance ?? cityStats?.complianceRate ?? "—"}
          unit="%"
          tone="teal"
        />
        <StatCard
          icon={TriangleAlert}
          label="Critical Bins"
          value={criticalBinCount ?? "—"}
          unit="bins ≥80%"
          tone="red"
        />
        <StatCard
          icon={Truck}
          label="Active Crews"
          value={cityStats?.activeCrews ?? "—"}
          tone="civic"
        />
        <StatCard
          icon={Route}
          label="Distance Saved"
          value={cityStats?.distanceSavedPercent ?? "—"}
          unit="%"
          tone="teal"
        />
        <StatCard
          icon={Package}
          label="Waste Diverted"
          value={cityStats?.wasteDivertedTons ?? "—"}
          unit="tons"
          tone="civic"
        />
      </div>
    </section>
  );
}
