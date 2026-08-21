import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MunicipalDashboard from "./sortify/MunicipalDashboard";
import CitizenDashboard from "./sortify/CitizenDashboard";

// Minimal app shell — Person 6 owns the real Landing Page + shared map +
// Tailwind theme tokens per the task brief. This is a stopgap scaffold so
// the repo is runnable while everyone's dashboards land; restyle freely,
// just keep the three routes (/citizen, /crew, /municipal) since that's
// what the role-select buttons need to point to.

function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 p-8 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Sortify</h1>
      <p className="max-w-md text-slate-500">
        Smart City Waste Management — connecting Citizens, Crews, and
        Municipal Authorities.
      </p>
      <div className="flex gap-3">
        <Link to="/citizen" className="rounded-lg bg-indigo-600 px-5 py-2.5 text-white font-medium hover:bg-indigo-700">
          Citizen
        </Link>
        <Link to="/crew" className="rounded-lg bg-emerald-600 px-5 py-2.5 text-white font-medium hover:bg-emerald-700">
          Crew
        </Link>
        <Link to="/municipal" className="rounded-lg bg-orange-600 px-5 py-2.5 text-white font-medium hover:bg-orange-700">
          Municipal
        </Link>
      </div>
    </div>
  );
}

function Placeholder({ role }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-slate-400">{role} dashboard not wired in yet.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/crew" element={<Placeholder role="Crew" />} />
        <Route path="/municipal" element={<MunicipalDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
