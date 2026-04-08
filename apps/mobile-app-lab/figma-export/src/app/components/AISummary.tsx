import { useNavigate } from "react-router";
import { ArrowLeft, Sparkles, Brain, Clock, Activity, ChevronRight, Plus } from "lucide-react";
import { cn } from "../lib/utils";

export function AISummary() {
  const navigate = useNavigate();

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
              <h1 className="text-xl font-bold text-white">KI-Zusammenfassung</h1>
              <span className="text-[11px] font-medium text-indigo-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> ResQBrain AI
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-8 mt-2">
        
        {/* Letzte Zusammenfassung */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Letzte Zusammenfassung</h2>
          <div className="bg-gradient-to-br from-indigo-900/20 to-[#121212] border border-indigo-500/20 rounded-[2rem] p-5 flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-3 z-10">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                <Activity className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-neutral-200">Reanimation B-Straße</span>
                <span className="text-xs text-neutral-400">Gestern, 14:30 Uhr</span>
              </div>
            </div>

            <p className="text-sm text-indigo-100/80 leading-relaxed z-10">
              Die CPR-Qualität war konstant hoch. Die Adrenalin-Gabe erfolgte etwas verzögert nach der 4. Minute. Empfehlung: Zeitmanagement bei der Medikation im nächsten Simulationstraining fokussieren.
            </p>

            <button className="w-full bg-[#1a1a1a]/80 backdrop-blur border border-[#2a2a2a] text-white py-3 rounded-xl text-sm font-bold transition-all mt-1 active:scale-95 flex items-center justify-center z-10">
              Details ansehen
            </button>
          </div>
        </section>

        {/* Neue Zusammenfassung erstellen */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Aktionen</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-[#121212] border border-[#2a2a2a] rounded-2xl p-4 flex flex-col gap-3 active:scale-[0.98] transition-transform">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-semibold text-neutral-200 text-[13px]">Einsatz Zusammenfassen</span>
              </div>
            </button>

            <button className="bg-[#121212] border border-[#2a2a2a] rounded-2xl p-4 flex flex-col gap-3 active:scale-[0.98] transition-transform">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <Brain className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-semibold text-neutral-200 text-[13px]">Lernen Zusammenfassen</span>
              </div>
            </button>
          </div>

          <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl text-[15px] font-bold transition-all shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 active:scale-[0.98] mt-2">
            <Plus className="w-5 h-5" /> Neue Zusammenfassung
          </button>
        </section>

        {/* Vergangene Zusammenfassungen */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Verlauf</h2>
          <div className="flex flex-col gap-2">
            <AISummaryCard 
              title="Anaphylaxie bei Kindern" 
              type="Lerntest" 
              date="Vor 3 Tagen" 
              preview="Gute Ergebnisse bei der Dosierungsberechnung. Schwächen bei der Auswahl der Zweitlinienmedikation identifiziert."
            />
            <AISummaryCard 
              title="ACS Fallbeispiel" 
              type="Einsatz" 
              date="Letzte Woche" 
              preview="Schnelle EKG-Diagnostik. Die O2-Gabe war gemäß aktueller Leitlinien nicht indiziert und sollte zukünftig restriktiver gehandhabt werden."
            />
            <AISummaryCard 
              title="Monatsbericht Februar" 
              type="Lernfortschritt" 
              date="01. März" 
              preview="Insgesamt 14 Lerneinheiten absolviert. Starke Verbesserung im Bereich pädiatrischer Notfälle im Vergleich zum Vormonat."
            />
          </div>
        </section>

      </div>
    </div>
  );
}

function AISummaryCard({ title, type, date, preview }: { title: string, type: string, date: string, preview: string }) {
  return (
    <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl p-4 flex flex-col gap-3 active:scale-[0.98] transition-transform cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center border border-neutral-700">
            {type === 'Einsatz' ? <Activity className="w-4 h-4 text-blue-400" /> : <Brain className="w-4 h-4 text-purple-400" />}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-neutral-200 text-[14px] leading-snug">{title}</span>
            <span className="text-[10px] uppercase tracking-wider text-neutral-500">{type}</span>
          </div>
        </div>
        <span className="text-xs text-neutral-600 font-medium">{date}</span>
      </div>
      <p className="text-sm text-neutral-400 leading-relaxed line-clamp-2">{preview}</p>
    </div>
  );
}