import { Fuel, Leaf } from "lucide-react";

export default function FuelCO2Savings({ fuelSavedLiters, co2AvoidedKg }) {
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="eyebrow">Fuel &amp; CO₂ Savings</h2>
        <span className="text-[10px] font-mono uppercase text-mist bg-panel2 border border-line rounded px-1.5 py-0.5">
          estimated
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-panel2 border border-line p-4 flex flex-col gap-1.5">
          <Fuel size={16} className="text-amber" strokeWidth={1.75} />
          <span className="stat-value text-xl text-amber">{fuelSavedLiters}</span>
          <span className="text-xs text-mist">liters of diesel saved / day</span>
        </div>
        <div className="rounded-lg bg-panel2 border border-line p-4 flex flex-col gap-1.5">
          <Leaf size={16} className="text-teal" strokeWidth={1.75} />
          <span className="stat-value text-xl text-teal">{co2AvoidedKg}</span>
          <span className="text-xs text-mist">kg CO₂ avoided / day</span>
        </div>
      </div>
    </div>
  );
}
