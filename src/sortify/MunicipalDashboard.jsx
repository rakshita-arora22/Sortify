import { useMunicipalData } from "./hooks/useMunicipalData";
import { estimateRouteEfficiency, estimateFuelAndCO2 } from "./utils/routeEfficiency";
import CityOverview from "./components/CityOverview";
import AnomalyAlerts from "./components/AnomalyAlerts";
import WardWatchlist from "./components/WardWatchlist";
import RouteEfficiency from "./components/RouteEfficiency";
import FuelCO2Savings from "./components/FuelCO2Savings";
import WardLeaderboard from "./components/WardLeaderboard";
import ComplianceGauge from "./components/ComplianceGauge";
import { Landmark } from "lucide-react";

export default function MunicipalDashboard() {
  const {
    loading,
    bins,
    cityStats,
    wardStats,
    cityCompliance,
    anomalies,
    criticalBinCount,
  } = useMunicipalData();

  const efficiency = estimateRouteEfficiency({
    binCount: bins.length,
    distanceSavedPercent: cityStats?.distanceSavedPercent,
  });
  const { fuelSavedLiters, co2AvoidedKg } = estimateFuelAndCO2(efficiency.savedKm);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-mist font-mono text-sm">
        Connecting to city feed…
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 md:px-10 py-8 max-w-[1400px] mx-auto flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-civic/10 border border-civic/30 flex items-center justify-center">
            <Landmark size={17} className="text-civic" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="font-display font-semibold text-lg text-ink leading-tight">
              Municipal Control
            </h1>
            <p className="text-xs text-mist">City-wide waste operations oversight</p>
          </div>
        </div>
        <ComplianceGauge value={cityCompliance} label="City compliance" size="sm" />
      </header>

      <CityOverview
        cityStats={cityStats}
        cityCompliance={cityCompliance}
        criticalBinCount={criticalBinCount}
      />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <WardWatchlist wardStats={wardStats} />
          <RouteEfficiency efficiency={efficiency} />
        </div>
        <div className="flex flex-col gap-4">
          <AnomalyAlerts anomalies={anomalies} />
          <FuelCO2Savings fuelSavedLiters={fuelSavedLiters} co2AvoidedKg={co2AvoidedKg} />
          <WardLeaderboard wardStats={wardStats} />
        </div>
      </section>
    </div>
  );
}