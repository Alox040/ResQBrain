import { Link, useNavigate } from "react-router";
import { Search, Activity, Pill, Stethoscope, AlertTriangle, BookOpen, Clock, ChevronRight, Zap } from "lucide-react";
import { cn } from "../lib/utils";

import { SearchFieldWithVoice } from "./SearchFieldWithVoice";

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-[#0a0a0a] text-neutral-100 p-4 pt-12 md:pt-4 gap-6">
      
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">ResQBrain</h1>
          <p className="text-sm text-neutral-400">Ready for service</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-red-950/50 flex items-center justify-center border border-red-900/30">
          <Stethoscope className="w-5 h-5 text-red-500" />
        </div>
      </header>

      {/* Fake Search Bar - Navigate to Search screen */}
      <div className="block w-full">
        <SearchFieldWithVoice 
          placeholder="Search algorithms, meds..."
          className="bg-[#1a1a1a] border-[#2a2a2a] h-12 cursor-text"
          onClick={() => navigate('/search')}
          readOnly
        />
      </div>

      {/* Emergency Mode Button */}
      <Link to="/einsatz" className="block w-full">
        <div className="w-full bg-[#1e0a0a] rounded-[2rem] p-5 border-2 border-red-900/50 flex items-center gap-5 active:scale-[0.98] transition-transform relative overflow-hidden">
          <div className="absolute inset-0 bg-red-500/10 pointer-events-none" />
          <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/50 shrink-0">
            <Zap className="w-7 h-7 text-white fill-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white tracking-tight">Einsatzmodus</h2>
            <p className="text-sm font-medium text-red-300 mt-1">Schnellzugriff im Einsatz</p>
          </div>
        </div>
      </Link>

      {/* Quick Access Tiles */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Quick Access</h2>
        <div className="grid grid-cols-2 gap-3">
          <QuickTile 
            to="/algorithm/anaphylaxis" 
            icon={<Activity className="w-6 h-6 text-red-400" />} 
            title="Algorithms" 
            count="42 Protocols" 
            bgColor="bg-red-950/20" 
            borderColor="border-red-900/30" 
          />
          <QuickTile 
            to="/medication/epinephrine" 
            icon={<Pill className="w-6 h-6 text-blue-400" />} 
            title="Medications" 
            count="128 Drugs" 
            bgColor="bg-blue-950/20" 
            borderColor="border-blue-900/30" 
          />
          <QuickTile 
            to="/search" 
            icon={<BookOpen className="w-6 h-6 text-emerald-400" />} 
            title="Guidelines" 
            count="ERC 2021" 
            bgColor="bg-emerald-950/20" 
            borderColor="border-emerald-900/30" 
          />
          <QuickTile 
            to="/search" 
            icon={<AlertTriangle className="w-6 h-6 text-amber-400" />} 
            title="Pediatrics" 
            count="Weight rules" 
            bgColor="bg-amber-950/20" 
            borderColor="border-amber-900/30" 
          />
        </div>
      </section>

      {/* Survey Banner (Temporary) */}
      <Link to="/survey">
        <div className="w-full bg-[#1a1a1a] rounded-2xl p-4 border border-[#2a2a2a] flex items-center gap-4 active:scale-[0.98] transition-transform relative overflow-hidden">
          <div className="absolute inset-0 bg-red-500/5 pointer-events-none" />
          <div className="flex-1">
            <h3 className="font-semibold text-white flex items-center gap-2">
              Help us improve!
              <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">MVP</span>
            </h3>
            <p className="text-sm text-neutral-400 mt-1">Take our 2-min survey for early access to upcoming features.</p>
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-500" />
        </div>
      </Link>

      {/* Recent Items */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Recent
        </h2>
        <div className="flex flex-col gap-2">
          <RecentRow to="/algorithm/anaphylaxis" title="Anaphylaxis (Adult)" type="Algorithm" />
          <RecentRow to="/medication/epinephrine" title="Epinephrine (Adrenalin)" type="Medication" />
          <RecentRow to="/algorithm/acs" title="Acute Coronary Syndrome" type="Protocol" />
        </div>
      </section>
      
    </div>
  );
}

function QuickTile({ to, icon, title, count, bgColor, borderColor }: { to: string, icon: React.ReactNode, title: string, count: string, bgColor: string, borderColor: string }) {
  return (
    <Link to={to} className={cn("flex flex-col gap-3 p-4 rounded-2xl border active:scale-[0.98] transition-all", bgColor, borderColor)}>
      {icon}
      <div>
        <h3 className="font-semibold text-neutral-100">{title}</h3>
        <p className="text-xs text-neutral-500 mt-0.5">{count}</p>
      </div>
    </Link>
  );
}

function RecentRow({ to, title, type }: { to: string, title: string, type: string }) {
  const isMed = type === "Medication";
  return (
    <Link to={to} className="flex items-center justify-between p-4 bg-[#121212] rounded-2xl border border-[#2a2a2a] active:scale-[0.98] transition-transform">
      <div className="flex items-center gap-4">
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", isMed ? "bg-blue-950/30 text-blue-400" : "bg-red-950/30 text-red-400")}>
          {isMed ? <Pill className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
        </div>
        <div>
          <h4 className="font-medium text-neutral-200">{title}</h4>
          <p className="text-xs text-neutral-500 mt-0.5">{type}</p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-neutral-600" />
    </Link>
  );
}
