import { Link, useNavigate } from "react-router";
import { Search, HeartPulse, ShieldAlert, Wind, Pill } from "lucide-react";
import { cn } from "../lib/utils";

import { SearchFieldWithVoice } from "./SearchFieldWithVoice";

export function Einsatzmodus() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-black text-neutral-100 p-4 pt-12 md:pt-4 gap-8">
      {/* Header */}
      <header className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)]">
          <HeartPulse className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white uppercase">Einsatz</h1>
          <p className="text-base text-red-400 font-medium mt-1">Schnellzugriff aktiviert</p>
        </div>
      </header>

      {/* Large Search Bar */}
      <div className="block w-full">
        <SearchFieldWithVoice
          placeholder="Suchen..."
          className="h-16 rounded-[2rem] pl-14 text-xl border-[#333] bg-[#1a1a1a] cursor-text"
          onClick={() => navigate('/search')}
          readOnly
        />
      </div>

      {/* Top Quick Actions */}
      <section className="flex flex-col gap-5">
        <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-500">Notfallprotokolle</h2>
        <div className="grid grid-cols-2 gap-4">
          <ActionTile 
            to="/algorithm/reanimation" 
            icon={<HeartPulse className="w-12 h-12 text-red-500" />} 
            title="Reanimation" 
            bgColor="bg-red-950/20" 
            borderColor="border-red-900/40" 
          />
          <ActionTile 
            to="/algorithm/anaphylaxis" 
            icon={<ShieldAlert className="w-12 h-12 text-orange-500" />} 
            title="Anaphylaxie" 
            bgColor="bg-orange-950/20" 
            borderColor="border-orange-900/40" 
          />
          <ActionTile 
            to="/algorithm/airway" 
            icon={<Wind className="w-12 h-12 text-blue-500" />} 
            title="Atemweg" 
            bgColor="bg-blue-950/20" 
            borderColor="border-blue-900/40" 
          />
          <ActionTile 
            to="/search" 
            icon={<Pill className="w-12 h-12 text-purple-500" />} 
            title="Medikamente" 
            bgColor="bg-purple-950/20" 
            borderColor="border-purple-900/40" 
          />
        </div>
      </section>
    </div>
  );
}

function ActionTile({ to, icon, title, bgColor, borderColor }: { to: string, icon: React.ReactNode, title: string, bgColor: string, borderColor: string }) {
  return (
    <Link to={to} className={cn("flex flex-col items-center justify-center gap-5 p-6 rounded-[2rem] border-2 active:scale-[0.95] transition-all text-center", bgColor, borderColor)}>
      {icon}
      <h3 className="text-lg font-bold text-neutral-100 leading-tight">{title}</h3>
    </Link>
  );
}
