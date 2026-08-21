import TodaysProgress from "./components/TodaysProgress";
import SmartRouteOptimization from "./components/SmartRouteOptimization";
import BinStatusList from "./components/BinStatusList";
import PendingPickupRequests from "./components/PendingPickupRequests";
import SegregationCheck from "./components/SegregationCheck";
import ComplaintsList from "./components/ComplaintsList";

// Drop this in as a route/page. Layout mirrors CitizenDashboard.jsx —
// restyle once Person 6's Tailwind theme tokens land.
export default function CrewDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-4">
        <TodaysProgress />
        <SmartRouteOptimization />
        <div className="grid md:grid-cols-2 gap-4">
          <BinStatusList />
          <PendingPickupRequests />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <SegregationCheck />
          <ComplaintsList />
        </div>
      </div>
    </div>
  );
}
