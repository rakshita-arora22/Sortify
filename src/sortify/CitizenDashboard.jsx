import ReadyForPickupForm from "./components/ReadyForPickupForm";
import ReportIssueForm from "./components/ReportIssueForm";
import MyRequestsAndReports from "./components/MyRequestsAndReports";
import HomeOverview from "./components/HomeOverview";
import SegregationScore from "./components/SegregationScore";
import RewardsStreak from "./components/RewardsStreak";
import SocietyLeaderboard from "./components/SocietyLeaderboard";
import DisposalGuide from "./components/DisposalGuide";

// Drop this in as a route/page once wired into the app shell. Layout is a
// simple stacked/2-col grid for now — restyle once Person 6's Tailwind
// theme tokens land (see README).
export default function CitizenDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-4">
        <HomeOverview />
        <div className="grid md:grid-cols-2 gap-4">
          <SegregationScore />
          <RewardsStreak />
        </div>
                <div className="grid md:grid-cols-2 gap-4">
          <SocietyLeaderboard />
          <DisposalGuide />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <ReadyForPickupForm />
          <ReportIssueForm />
        </div>
        <MyRequestsAndReports />
      </div>
    </div>
  );
}
