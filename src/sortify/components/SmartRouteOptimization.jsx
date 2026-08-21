import { useEffect, useState, useMemo } from "react";
import { subscribeToBins, subscribeToPickupRequests } from "../lib/firestoreHelpers";
import { DEPOT, PICKUP_STATUS } from "../lib/constants";
import { buildTodaysRoute } from "../lib/routeOptimization";

// Adapts our Firestore doc shapes into what routeOptimization.js expects
// (fillPercent instead of fillLevel, lowercase pending/collected status).
function toRouteBin(b) {
  return {
    id: b.id,
    lat: b.lat,
    lng: b.lng,
    fillPercent: b.fillLevel,
    wasteType: b.wasteType,
  };
}

function toRoutePickup(p) {
  return {
    id: p.id,
    lat: p.lat,
    lng: p.lng,
    category: p.wasteType,
    status: p.status === PICKUP_STATUS.REQUESTED ? "pending" : "collected",
  };
}

export default function SmartRouteOptimization() {
  const [bins, setBins] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubBins = subscribeToBins((data) => {
      setBins(data);
      setLoading(false);
    });
    const unsubPickups = subscribeToPickupRequests(setPickups);
    return () => {
      unsubBins();
      unsubPickups();
    };
  }, []);

  const route = useMemo(() => {
    if (!bins.length && !pickups.length) return null;
    return buildTodaysRoute({
      bins: bins.map(toRouteBin),
      pickupRequests: pickups.map(toRoutePickup),
      depot: DEPOT,
    });
  }, [bins, pickups]);

  if (loading) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm animate-pulse h-64" />;
  }

  if (!route || route.smart.stats.stopCount === 0) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Smart Route Optimization</h2>
        <p className="text-sm text-slate-400">No bins above the fill threshold right now — nothing to route.</p>
      </div>
    );
  }

  const { fixed, smart, percentDistanceSaved } = route;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Smart Route Optimization</h2>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
          {percentDistanceSaved}% distance saved
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold text-slate-400 mb-2">FIXED ROUTE</p>
          <Stat label="Stops" value={fixed.stats.stopCount} />
          <Stat label="Distance" value={`${fixed.stats.totalDistanceKm} km`} />
          <Stat label="Time" value={`${fixed.stats.estimatedTimeMin} min`} />
          <Stat label="Fuel" value={`${fixed.stats.fuelEstimateL} L`} />
        </div>
        <div className="rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
          <p className="text-xs font-semibold text-emerald-600 mb-2">SMART ROUTE</p>
          <Stat label="Stops" value={smart.stats.stopCount} />
          <Stat label="Distance" value={`${smart.stats.totalDistanceKm} km`} />
          <Stat label="Time" value={`${smart.stats.estimatedTimeMin} min`} />
          <Stat label="Fuel" value={`${smart.stats.fuelEstimateL} L`} />
        </div>
      </div>

      <h3 className="text-sm font-semibold text-slate-700 mb-2">Today's stops (in order)</h3>
      <ol className="space-y-1 max-h-56 overflow-y-auto">
        {smart.orderedStops.map((stop, i) => (
          <li key={stop.id} className="flex justify-between text-sm py-1.5 border-b border-slate-50">
            <span className="text-slate-600">
              {i + 1}. {stop.type === "bin" ? "🗑️ Bin" : "📍 Pickup"} · {stop.wasteType}
            </span>
            <span className="text-slate-400">{stop.fillPercent}%</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex justify-between text-sm py-0.5">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  );
}
