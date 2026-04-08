import { useNavigate } from "react-router";
import { ArrowLeft, Home, Zap, Heart, LayoutGrid, Star, Edit3, Save } from "lucide-react";
import { cn } from "../lib/utils";
import { useState } from "react";

export function PersonalizationSettings() {
  const navigate = useNavigate();
  const [einsatzPrioritise, setEinsatzPrioritise] = useState(true);

  return (
    <div className="flex flex-col min-h-full bg-black text-neutral-100 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#2a2a2a]">
        <div className="flex items-center gap-3 p-4 pt-12 md:pt-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] text-neutral-400 active:scale-95 transition-transform border border-[#2a2a2a]">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white">Personalisierung</h1>
            <span className="text-[11px] font-medium text-neutral-500">App-Verhalten anpassen</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-8 mt-2">
        
        {/* App Start */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Startverhalten</h2>
          
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 hover:bg-[#1a1a1a] transition-colors cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center shrink-0 border border-[#2a2a2a]">
                  <Home className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-neutral-200 text-[15px]">Standard Startscreen</span>
                  <p className="text-xs text-neutral-500 leading-snug">Wähle, was nach dem Start der App zuerst angezeigt wird.</p>
                </div>
              </div>
              <select className="bg-transparent border-none outline-none text-sm text-indigo-400 font-bold ml-2 appearance-none text-right">
                <option>Zentrale Hub</option>
                <option>Dashboard</option>
                <option>Einsatzmodus</option>
              </select>
            </div>

            <div className="h-[1px] w-full bg-[#2a2a2a] ml-16" />

            <div className="flex items-center justify-between p-4 hover:bg-[#1a1a1a] transition-colors cursor-pointer" onClick={() => setEinsatzPrioritise(!einsatzPrioritise)}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                  <Zap className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-neutral-200 text-[15px]">Einsatzmodus priorisieren</span>
                  <p className="text-xs text-neutral-500 leading-snug">Der rote Einsatz-Button ist visuell noch präsenter hervorgehoben.</p>
                </div>
              </div>
              <div className={cn(
                "w-12 h-6 rounded-full flex items-center shrink-0 transition-colors p-1",
                einsatzPrioritise ? "bg-red-500" : "bg-[#2a2a2a]"
              )}>
                <div className={cn(
                  "w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                  einsatzPrioritise ? "translate-x-6" : "translate-x-0"
                )} />
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard & Quick Access */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Dashboard & Zugriff</h2>
          
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 hover:bg-[#1a1a1a] transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center shrink-0 border border-[#2a2a2a]">
                  <LayoutGrid className="w-5 h-5 text-amber-400" />
                </div>
                <span className="font-semibold text-neutral-200 text-[15px]">Schnellzugriffe bearbeiten</span>
              </div>
              <Edit3 className="w-5 h-5 text-neutral-600" />
            </div>

            <div className="h-[1px] w-full bg-[#2a2a2a] ml-16" />

            <div className="flex items-center justify-between p-4 hover:bg-[#1a1a1a] transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center shrink-0 border border-[#2a2a2a]">
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>
                <span className="font-semibold text-neutral-200 text-[15px]">Lieblingsbereiche wählen</span>
              </div>
              <span className="text-xs font-medium text-neutral-500">4 aktiv</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}