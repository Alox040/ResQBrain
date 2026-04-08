import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Search as SearchIcon, Zap, Activity, Pill, Book, Baby, Play, ClipboardList, Clock, MessageSquare, ChevronRight, Sparkles, Bell, Dices } from "lucide-react";
import { cn } from "../lib/utils";

import { SearchFieldWithVoice } from "./SearchFieldWithVoice";
import { StatusSelector } from "./StatusSelector";

export function Start() {
  const navigate = useNavigate();
  const [hasUnreadNews, setHasUnreadNews] = useState(() => sessionStorage.getItem('newsRead') !== 'true');

  const handleNewsClick = () => {
    sessionStorage.setItem('newsRead', 'true');
    setHasUnreadNews(false);
    navigate('/news');
  };

  const handleRandomCase = () => {
    const randomRoutes = [
      '/algorithm/anaphylaxis',
      '/algorithm/pediatric-cpr',
      '/medication/epinephrine',
      '/learn/mode',
      '/tests/run/1'
    ];
    const randomRoute = randomRoutes[Math.floor(Math.random() * randomRoutes.length)];
    navigate(randomRoute);
  };

  return (
    <div className="flex flex-col min-h-full bg-black text-neutral-100 p-4 pt-12 md:pt-4 gap-6 pb-24">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-white">ResQBrain</h1>
          <StatusSelector />
        </div>
        
        <div className="flex items-center gap-2">
          <HeaderActionButton 
            icon={<Sparkles className="w-5 h-5 text-indigo-400" />} 
            onClick={() => navigate('/ai-summary')} 
            tooltip="KI-Zusammenfassung"
          />
          <HeaderActionButton 
            icon={
              <div className="relative">
                <Bell className="w-5 h-5 text-neutral-400" />
                {hasUnreadNews && <NotificationBadge />}
              </div>
            } 
            onClick={handleNewsClick} 
            tooltip="Neuigkeiten"
          />
          <HeaderActionButton 
            icon={<Dices className="w-5 h-5 text-amber-400" />} 
            onClick={handleRandomCase} 
            tooltip="Zufallsfall"
          />
        </div>
      </header>
      
      {/* Search Bar */}
      <div className="block w-full">
        <SearchFieldWithVoice 
          placeholder="Suchen nach Algorithmen..."
          className="bg-[#121212] border-[#2a2a2a] text-neutral-400 placeholder:text-neutral-500 shadow-sm py-[18px] cursor-text"
          onClick={() => navigate('/search')}
          readOnly
        />
      </div>
      
      {/* Einsatzmodus Hero */}
      <Link to="/einsatz" className="bg-red-500/10 border border-red-500/20 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center gap-3 active:scale-[0.98] transition-transform relative overflow-hidden shadow-lg shadow-red-900/10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full blur-3xl" />
        <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30 relative z-10">
          <Zap className="w-7 h-7 text-red-500 fill-red-500/20" />
        </div>
        <div className="relative z-10">
          <h2 className="text-xl font-bold text-red-500">Einsatzmodus</h2>
          <p className="text-xs text-red-400/80 mt-1">Für den aktiven Notfall optimiert</p>
        </div>
      </Link>
      
      {/* Quick Access Grid */}
      <div className="grid grid-cols-2 gap-3">
        <QuickCard to="/algorithms" icon={<Activity className="text-indigo-400 w-6 h-6" />} label="Algorithmen" />
        <QuickCard to="/medications" icon={<Pill className="text-emerald-400 w-6 h-6" />} label="Medikamente" />
        <QuickCard to="/search" icon={<Book className="text-cyan-400 w-6 h-6" />} label="Guidelines" />
        <QuickCard to="/search" icon={<Baby className="text-pink-400 w-6 h-6" />} label="Pädiatrie" />
      </div>
      
      {/* Small Section: Dein Bereich */}
      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Dein Bereich</h3>
        <div className="flex flex-col gap-2">
          <ListCard to="/learn/mode" icon={<Play className="w-4 h-4 text-purple-400 fill-purple-400/20" />} title="Weiterlernen" subtitle="Pädiatrische Reanimation" />
          <ListCard to="/learn/review/1" icon={<ClipboardList className="w-4 h-4 text-amber-400" />} title="Offene Nachbereitung" subtitle="Reanimation B-Straße" badge="Offen" />
          <ListCard to="/algorithm/pediatric-cpr" icon={<Clock className="w-4 h-4 text-neutral-400" />} title="Zuletzt angesehen" subtitle="Anaphylaxie Algorithmus" />
        </div>
      </section>
      
      {/* Survey / Feedback */}
      <Link to="/survey" className="bg-[#121212] border border-[#2a2a2a] rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform mt-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <MessageSquare className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-neutral-200">Feedback geben</span>
            <span className="text-xs text-neutral-500">Hilf uns bei der Entwicklung</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-neutral-600" />
      </Link>
    </div>
  );
}

function HeaderActionButton({ icon, onClick, tooltip }: { icon: React.ReactNode, onClick: () => void, tooltip: string }) {
  return (
    <button 
      onClick={onClick} 
      title={tooltip}
      className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center border border-[#2a2a2a] active:scale-95 transition-transform"
    >
      {icon}
    </button>
  );
}

function NotificationBadge() {
  return (
    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1a1a1a]" />
  );
}

function QuickCard({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  return (
    <Link to={to} className="bg-[#121212] border border-[#2a2a2a] rounded-2xl p-4 flex flex-col gap-3 active:scale-[0.98] transition-transform">
      <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center border border-[#2a2a2a]">
        {icon}
      </div>
      <span className="font-semibold text-neutral-200 text-sm">{label}</span>
    </Link>
  );
}

function ListCard({ to, icon, title, subtitle, badge }: { to: string, icon: React.ReactNode, title: string, subtitle: string, badge?: string }) {
  return (
    <Link to={to} className="flex items-center justify-between p-3.5 bg-[#121212] rounded-xl border border-[#2a2a2a] active:scale-[0.98] transition-transform">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center border border-[#2a2a2a]">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-neutral-200">{title}</span>
          <span className="text-[11px] text-neutral-500">{subtitle}</span>
        </div>
      </div>
      {badge ? (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md text-amber-400 bg-amber-500/10 border border-amber-500/20">
          {badge}
        </span>
      ) : (
        <ChevronRight className="w-4 h-4 text-neutral-600" />
      )}
    </Link>
  );
}
