import { useNavigate } from "react-router";
import { ArrowLeft, Building2, MapPin, ShieldCheck, CheckCircle2, ChevronRight, Globe, Lock, Search } from "lucide-react";
import { cn } from "../lib/utils";
import { useState } from "react";

import { SearchFieldWithVoice } from "./SearchFieldWithVoice";

export function OrganizationSettings() {
  const navigate = useNavigate();
  const [combineContent, setCombineContent] = useState(true);

  return (
    <div className="flex flex-col min-h-full bg-black text-neutral-100 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#2a2a2a]">
        <div className="flex items-center gap-3 p-4 pt-12 md:pt-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] text-neutral-400 active:scale-95 transition-transform border border-[#2a2a2a]">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white">Organisation</h1>
            <span className="text-[11px] font-medium text-neutral-500">Zugehörigkeit verwalten</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-8 mt-2">
        
        {/* Current Organization */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Aktuelle Zugehörigkeit</h2>
          
          <div className="bg-gradient-to-br from-blue-900/20 to-[#121212] border border-blue-500/20 rounded-[2rem] p-6 flex flex-col gap-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
            
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <Building2 className="w-7 h-7 text-blue-400" />
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" /> Verifiziert
              </span>
            </div>

            <div className="flex flex-col gap-1 z-10">
              <h2 className="text-xl font-bold text-white">Rettungsdienst Nord</h2>
              <div className="flex items-center gap-2 text-sm text-blue-300/80 font-medium">
                <MapPin className="w-4 h-4" /> Wache 1 (Mitte)
              </div>
            </div>

            <button className="w-full bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-white py-3 rounded-xl text-sm font-bold transition-all mt-2 active:scale-95 flex items-center justify-center">
              Organisation wechseln
            </button>
          </div>
        </section>

        {/* Visibility Toggles */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Inhalte & Anzeige</h2>
          
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl p-2 flex flex-col gap-1">
            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors cursor-pointer" onClick={() => setCombineContent(!combineContent)}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-neutral-200 text-[15px]">Öffentliche + Interne Inhalte</span>
                  <p className="text-xs text-neutral-500 leading-snug">
                    Standard SOPs von ResQBrain mit den Vorgaben deiner Organisation kombinieren.
                  </p>
                </div>
              </div>
              <div className={cn(
                "w-12 h-6 rounded-full flex items-center shrink-0 transition-colors p-1",
                combineContent ? "bg-emerald-500" : "bg-[#2a2a2a]"
              )}>
                <div className={cn(
                  "w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                  combineContent ? "translate-x-6" : "translate-x-0"
                )} />
              </div>
            </div>

            <div className="h-[1px] w-full bg-[#2a2a2a] ml-16" />

            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-[#1a1a1a] transition-colors cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                  <Lock className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-neutral-200 text-[15px]">Strikter Organisationsmodus</span>
                  <p className="text-xs text-neutral-500 leading-snug">
                    Blendet alle nicht freigegebenen Algorithmen aus.
                  </p>
                </div>
              </div>
              <div className="w-12 h-6 rounded-full bg-[#2a2a2a] flex items-center shrink-0 transition-colors p-1">
                <div className="w-4 h-4 rounded-full bg-white shadow-sm transition-transform translate-x-0" />
              </div>
            </div>
          </div>
        </section>

        {/* Find Organization */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Neue Organisation finden</h2>
          
          <SearchFieldWithVoice 
            placeholder="Name oder Code eingeben..."
            className="py-4"
          />

          <div className="flex flex-col gap-2 mt-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 pl-1">Vorschläge in deiner Nähe</h3>
            
            <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl p-2 flex flex-col gap-1">
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#1a1a1a] transition-colors cursor-pointer">
                <div className="flex flex-col">
                  <span className="font-semibold text-neutral-200 text-[14px]">Feuerwehr Stadt Süd</span>
                  <span className="text-xs text-neutral-500">12 Wachen · Öffentlich zugänglich</span>
                </div>
                <button className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg active:scale-95 transition-transform">Beitreten</button>
              </div>
              <div className="h-[1px] w-full bg-[#2a2a2a] ml-2" />
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#1a1a1a] transition-colors cursor-pointer">
                <div className="flex flex-col">
                  <span className="font-semibold text-neutral-200 text-[14px]">DRK Kreisverband Ost</span>
                  <span className="text-xs text-neutral-500">Geschlossene Gruppe</span>
                </div>
                <button className="text-xs font-bold text-neutral-400 bg-[#2a2a2a] px-3 py-1.5 rounded-lg active:scale-95 transition-transform">Anfragen</button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}