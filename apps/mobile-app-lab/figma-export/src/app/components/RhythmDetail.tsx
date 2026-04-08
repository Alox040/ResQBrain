import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Star, HeartPulse, Activity, Zap, PlayCircle, Plus } from "lucide-react";
import { cn } from "../lib/utils";

export function RhythmDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock data mapping
  const rhythmData: Record<string, any> = {
    "vfl": {
      name: "Vorhofflimmern",
      category: "Schmal-komplex",
      description: "Absolut arrhythmisch, keine P-Wellen abgrenzbar, Flimmerwellen möglich.",
      features: [
        "Unregelmäßige RR-Intervalle (Arrhythmia absoluta)",
        "Fehlende P-Wellen",
        "Schmale QRS-Komplexe (< 120ms)",
        "Flimmerwellen (f-Wellen)"
      ],
      therapy: [
        "Frequenzkontrolle (z.B. Beta-Blocker, Calciumantagonisten)",
        "Rhythmuskontrolle bei hämodynamischer Instabilität (elektrische Kardioversion)",
        "Antikoagulation je nach CHADS2-VASc Score"
      ],
      color: "cyan"
    },
    "vt": {
      name: "Ventrikuläre Tachykardie",
      category: "Breitkomplex / Schockbar",
      description: "Lebensbedrohliche Herzrhythmusstörung aus den Herzkammern.",
      features: [
        "Breite QRS-Komplexe (> 120ms)",
        "Herzfrequenz meist > 120/min",
        "Regelmäßige RR-Intervalle (meistens)",
        "AV-Dissoziation möglich"
      ],
      therapy: [
        "Ohne Puls: Sofortige Defibrillation, CPR nach ACLS-Algorithmus",
        "Mit Puls (instabil): Synchronisierte Kardioversion",
        "Mit Puls (stabil): Amiodaron 300mg i.v. über 10-20 min"
      ],
      color: "amber"
    }
  };

  const data = rhythmData[id || "vfl"] || {
    name: "Sinusrhythmus",
    category: "Normal",
    description: "Normale elektrische Aktivität des Herzens.",
    features: ["P-Welle vor jedem QRS-Komplex", "Regelmäßige RR-Intervalle", "Normale Frequenz (60-100/min)"],
    therapy: ["Keine spezifische Therapie erforderlich", "Grundkrankheit behandeln, falls vorliegend"],
    color: "emerald"
  };

  const getThemeColor = () => {
    switch(data.color) {
      case 'cyan': return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
      case 'amber': return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case 'red': return "text-red-400 bg-red-500/10 border-red-500/20";
      default: return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    }
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
              <h1 className="text-xl font-bold text-white">{data.name}</h1>
              <span className={cn("text-[11px] font-medium uppercase tracking-wider", data.color === 'cyan' ? 'text-cyan-500' : data.color === 'amber' ? 'text-amber-500' : 'text-emerald-500')}>{data.category}</span>
            </div>
          </div>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-[#2a2a2a] active:scale-95 transition-transform"
          >
            <Star className={cn("w-5 h-5 transition-colors", isFavorite ? "text-yellow-400 fill-yellow-400" : "text-neutral-400")} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 mt-4 p-4">
        
        {/* Große EKG Kurve */}
        <div className={cn("w-full h-48 rounded-[2rem] border relative overflow-hidden flex items-center justify-center", getThemeColor())}>
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
          
          <svg viewBox="0 0 400 100" className="w-full h-full relative z-10 px-4" preserveAspectRatio="none">
             <path 
               d="M0 50 L30 50 L35 40 L45 60 L55 50 L65 50 L75 10 L85 90 L95 50 L110 50 L120 40 L130 50 L180 50 L185 40 L195 60 L205 50 L215 50 L225 10 L235 90 L245 50 L260 50 L270 40 L280 50 L330 50 L335 40 L345 60 L355 50 L365 50 L375 10 L385 90 L395 50 L400 50" 
               className={cn("fill-none stroke-[2.5] stroke-current")} 
               strokeLinecap="round" 
               strokeLinejoin="round" 
             />
          </svg>

          <div className="absolute bottom-3 right-4 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
            <PlayCircle className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider">Animation starten</span>
          </div>
        </div>

        <p className="text-[15px] text-neutral-300 leading-relaxed px-1">
          {data.description}
        </p>

        {/* Merkmale */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1 flex items-center gap-2">
            <Activity className="w-4 h-4 text-neutral-400" /> EKG Merkmale
          </h2>
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl p-4 flex flex-col gap-3">
            {data.features.map((feature: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-600 mt-2 shrink-0" />
                <span className="text-sm text-neutral-300 leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Therapie Hinweise */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1 flex items-center gap-2">
            <Zap className="w-4 h-4 text-neutral-400" /> Therapie Hinweise
          </h2>
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl p-4 flex flex-col gap-3">
            {data.therapy.map((therapy: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-neutral-400">
                  {idx + 1}
                </div>
                <span className="text-sm text-neutral-300 leading-relaxed">{therapy}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Notizen */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1 flex items-center gap-2">
            Eigene Notizen
          </h2>
          <button className="bg-[#121212] border border-dashed border-[#3a3a3a] rounded-2xl p-4 flex items-center justify-center gap-2 text-neutral-500 hover:bg-[#1a1a1a] transition-colors active:scale-95">
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">Notiz hinzufügen</span>
          </button>
        </section>

      </div>
    </div>
  );
}