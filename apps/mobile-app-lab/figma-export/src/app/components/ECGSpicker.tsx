import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Activity, HeartPulse, Zap, AlertTriangle, ChevronRight, SlidersHorizontal, Settings } from "lucide-react";
import { cn } from "../lib/utils";

export function ECGSpicker() {
  const navigate = useNavigate();
  const [isPinned, setIsPinned] = useState(() => localStorage.getItem('pinEKGToNav') === 'true');

  const togglePin = () => {
    const newState = !isPinned;
    setIsPinned(newState);
    localStorage.setItem('pinEKGToNav', String(newState));
    // Provide some visual feedback or reload if needed. Let layout handle it on mount/render.
    // Dispatch a custom event to notify MobileLayout to update immediately
    window.dispatchEvent(new Event('navStateChanged'));
  };

  return (
    <div className="flex flex-col min-h-full bg-black text-neutral-100 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between p-4 pt-12 md:pt-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] text-neutral-400 active:scale-95 transition-transform border border-[#2a2a2a]">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white">EKG-Spicker</h1>
              <span className="text-[11px] font-medium text-emerald-500">Schnelle Rhythmusübersicht</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-8 mt-2">
        
        {/* Schnellzugriff */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Schnellzugriff</h2>
          <div className="grid grid-cols-2 gap-3">
            <ECGCard title="Bradykardie" icon={<HeartPulse className="w-6 h-6 text-blue-400" />} color="blue" />
            <ECGCard title="Tachykardie" icon={<Activity className="w-6 h-6 text-red-400" />} color="red" />
            <ECGCard title="Schockbare Rhythmen" icon={<Zap className="w-6 h-6 text-amber-400" />} color="amber" />
            <ECGCard title="Nicht schockbar" icon={<AlertTriangle className="w-6 h-6 text-neutral-400" />} color="neutral" />
            <ECGCard title="Breitkomplex" icon={<Activity className="w-6 h-6 text-purple-400" />} color="purple" />
            <ECGCard title="Schmal-komplex" icon={<Activity className="w-6 h-6 text-cyan-400" />} color="cyan" />
          </div>
        </section>

        {/* Alle Rhythmen */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Alle Rhythmen</h2>
          <div className="flex flex-col gap-2">
            <RhythmusListItem id="sr" name="Sinusrhythmus" category="Normal" />
            <RhythmusListItem id="vfl" name="Vorhofflimmern" category="Schmal-komplex" />
            <RhythmusListItem id="vfla" name="Vorhofflattern" category="Schmal-komplex" />
            <RhythmusListItem id="av1" name="AV Block I°" category="Bradykard" />
            <RhythmusListItem id="av2" name="AV Block II°" category="Bradykard" />
            <RhythmusListItem id="av3" name="AV Block III°" category="Bradykard" />
            <RhythmusListItem id="svt" name="SVT" category="Schmal-komplex" />
            <RhythmusListItem id="vt" name="VT" category="Schockbar / Breitkomplex" />
            <RhythmusListItem id="vf" name="VF" category="Schockbar" />
            <RhythmusListItem id="pea" name="PEA" category="Nicht schockbar" />
            <RhythmusListItem id="asy" name="Asystolie" category="Nicht schockbar" />
          </div>
        </section>

        {/* Merkhilfen */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Merkhilfen</h2>
          <div className="grid grid-cols-2 gap-3">
            <HelperCard title="Defibrillierbar vs nicht" />
            <HelperCard title="Frequenzgrenzen" />
            <HelperCard title="ACLS Übersicht" />
            <HelperCard title="Medikamentenhinweise" />
          </div>
        </section>

        {/* Personalisierung */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Personalisierung</h2>
          
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl p-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="font-semibold text-neutral-200">Eigenen Spicker anpassen</span>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">Favoriten Rhythmen</span>
                <ChevronRight className="w-4 h-4 text-neutral-600" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">Eigene Notizen</span>
                <ChevronRight className="w-4 h-4 text-neutral-600" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">Reihenfolge ändern</span>
                <ChevronRight className="w-4 h-4 text-neutral-600" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">Nur relevante anzeigen</span>
                <div className="w-10 h-6 rounded-full bg-[#2a2a2a] p-1 relative">
                  <div className="w-4 h-4 rounded-full bg-neutral-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Settings className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-neutral-200 text-sm">Zum unteren Menü hinzufügen</span>
                <span className="text-[11px] text-neutral-500">Ersetzt "Search" im Tab-Menü</span>
              </div>
            </div>
            <button 
              onClick={togglePin}
              className={cn(
                "w-12 h-6 rounded-full flex items-center px-1 transition-colors duration-300 border border-[#2a2a2a]",
                isPinned ? "bg-emerald-500 border-emerald-500" : "bg-[#1a1a1a]"
              )}
            >
              <div className={cn(
                "w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm",
                isPinned ? "translate-x-6" : "translate-x-0"
              )} />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}

function ECGCard({ title, icon, color }: { title: string, icon: React.ReactNode, color: string }) {
  const bgColors: Record<string, string> = {
    blue: "bg-blue-500/10 border-blue-500/20",
    red: "bg-red-500/10 border-red-500/20",
    amber: "bg-amber-500/10 border-amber-500/20",
    neutral: "bg-neutral-800 border-neutral-700",
    purple: "bg-purple-500/10 border-purple-500/20",
    cyan: "bg-cyan-500/10 border-cyan-500/20",
  };

  return (
    <div className={cn("rounded-2xl p-4 flex flex-col gap-3 active:scale-[0.98] transition-transform border cursor-pointer", bgColors[color])}>
      <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center border border-white/5">
        {icon}
      </div>
      <span className="font-semibold text-neutral-200 text-sm leading-tight">{title}</span>
    </div>
  );
}

function RhythmusListItem({ id, name, category }: { id: string, name: string, category: string }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/ekg-spicker/${id}`)}
      className="flex items-center justify-between p-3.5 bg-[#121212] border border-[#2a2a2a] rounded-xl active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className="flex items-center gap-4">
        {/* Fake ECG mini preview */}
        <div className="w-12 h-8 flex items-center bg-emerald-500/10 border border-emerald-500/20 rounded-lg overflow-hidden relative opacity-80">
          <svg viewBox="0 0 100 30" className="w-full h-full stroke-emerald-500 stroke-[1.5] fill-none" preserveAspectRatio="none">
             <path d="M0 15 L10 15 L15 5 L20 25 L25 10 L30 15 L40 15 L45 5 L50 25 L55 10 L60 15 L70 15 L75 5 L80 25 L85 10 L90 15 L100 15" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-200 text-sm">{name}</span>
          <span className="text-[11px] text-neutral-500">{category}</span>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-neutral-600" />
    </div>
  );
}

function HelperCard({ title }: { title: string }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3 flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer">
      <span className="text-xs font-semibold text-neutral-300">{title}</span>
      <ChevronRight className="w-4 h-4 text-neutral-600" />
    </div>
  );
}