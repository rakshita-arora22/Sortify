import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { Route } from "lucide-react";

export default function RouteEfficiency({ efficiency }) {
  const data = [
    { name: "Fixed route", km: efficiency.fixedDistanceKm },
    { name: "Smart route", km: efficiency.smartDistanceKm },
  ];

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Route size={15} className="text-civic" />
          <h2 className="eyebrow">Route Efficiency — city scale</h2>
        </div>
        <span className="text-sm font-mono text-teal">−{efficiency.percentSaved}%</span>
      </div>
      <p className="text-xs text-mist mb-4">
        Estimated from live bin count × Crew's live distance-saved %.
      </p>

      <div style={{ width: "100%", height: 180 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24 }}>
            <CartesianGrid horizontal={false} stroke="#232E45" />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              width={90}
              tick={{ fill: "#8592AD", fontSize: 12, fontFamily: "Inter" }}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              contentStyle={{
                background: "#131B2C",
                border: "1px solid #232E45",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "#E7ECF5" }}
              formatter={(v) => [`${v} km`, "Distance"]}
            />
            <Bar dataKey="km" radius={[0, 6, 6, 0]} barSize={28}>
              <Cell fill="#8592AD" />
              <Cell fill="#22C3A6" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between text-xs font-mono text-mist mt-2 pt-3 border-t border-line">
        <span>Saved: {efficiency.savedKm} km</span>
        <span>
          Fixed {efficiency.fixedDistanceKm} km → Smart {efficiency.smartDistanceKm} km
        </span>
      </div>
    </div>
  );
}
