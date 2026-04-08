import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Download, Play, ShieldCheck, Check, Info } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

export function ContentDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isAdded, setIsAdded] = useState(false);

  return (
    <div className="flex flex-col min-h-full bg-black text-neutral-100 pb-24 relative">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#121212]/80 backdrop-blur-md border-b border-[#2a2a2a] flex items-center gap-4 p-4 pt-12 md:pt-4 transition-all">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] text-neutral-400 active:scale-95 transition-transform shrink-0 border border-[#2a2a2a]">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 truncate">
          <h1 className="text-sm font-bold text-white truncate">ACLS MegaCode Simulator</h1>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-8">
        {/* Title & Meta */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-md text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">Kostenlos</span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-md text-neutral-400 bg-[#1a1a1a] border border-[#2a2a2a]">Training</span>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight text-white leading-[1.15]">ACLS MegaCode Simulator</h1>
          
          <div className="flex items-center gap-2 mt-1 bg-[#121212] p-2 pr-4 rounded-xl border border-[#2a2a2a] w-max cursor-pointer active:scale-95 transition-transform" onClick={() => navigate('/marketplace/partner/1')}>
            <div className="w-8 h-8 rounded-[10px] bg-[#1a1a1a] flex items-center justify-center border border-black shadow-sm">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-sm font-bold text-neutral-200">MeduLearn</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isAdded ? (
            <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl text-[15px] font-bold transition-colors active:scale-95 flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-900/20">
              <Play className="w-4 h-4 fill-current" /> Öffnen & Starten
            </button>
          ) : (
            <button onClick={() => setIsAdded(true)} className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-2xl text-[15px] font-bold transition-colors active:scale-95 flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-900/20">
              <Download className="w-4 h-4" /> Zum Profil hinzufügen
            </button>
          )}
        </div>

        {/* Description */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1 flex items-center gap-2">
            <Info className="w-3.5 h-3.5" /> Beschreibung
          </h2>
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl p-5">
            <p className="text-[15px] text-neutral-300 leading-relaxed">
              Dieses interaktive Trainingspaket simuliert komplexe ACLS MegaCode Situationen. Trainiere deine Entscheidungsfindung unter Zeitdruck und erhalte sofortiges Feedback zu Rhythmusanalyse und Medikamentengabe.
            </p>
          </div>
        </section>

        {/* Inhalte Liste */}
        <section className="flex flex-col gap-3 mt-2 mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Inhalte in diesem Paket</h2>
          <ul className="flex flex-col gap-2.5">
            <ContentListItem title="VF/pVT Simulator" duration="15 Min" />
            <ContentListItem title="PEA/Asystolie Algorithmus" duration="10 Min" />
            <ContentListItem title="Bradykardie mit Pacing" duration="20 Min" />
            <ContentListItem title="Tachykardie mit Kardioversion" duration="15 Min" />
          </ul>
        </section>
      </div>
    </div>
  );
}

function ContentListItem({ title, duration }: { title: string, duration: string }) {
  return (
    <li className="flex items-center justify-between p-4 bg-[#121212] rounded-2xl border border-[#2a2a2a]">
      <div className="flex items-center gap-3.5">
        <div className="w-9 h-9 rounded-[10px] bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
          <Check className="w-4 h-4 text-cyan-400" />
        </div>
        <span className="text-[15px] font-semibold text-neutral-200">{title}</span>
      </div>
      <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider bg-[#1a1a1a] px-2.5 py-1 rounded-md border border-[#2a2a2a]">{duration}</span>
    </li>
  );
}
