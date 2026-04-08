import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Pill, AlertOctagon, CheckCircle, Info, Calculator, Bookmark } from "lucide-react";

// Mock Data
const MEDICATIONS: Record<string, any> = {
  epinephrine: {
    name: "Epinephrine",
    altName: "Adrenalin",
    class: "Sympathomimetic",
    dosages: [
      { indication: "Anaphylaxis (Adult)", dose: "0.5 mg", route: "IM", notes: "1:1000 (1mg/1ml) solution" },
      { indication: "Cardiac Arrest", dose: "1.0 mg", route: "IV/IO", notes: "1:10000 (1mg/10ml) solution. Every 3-5 min." },
      { indication: "Severe Asthma", dose: "0.3 mg", route: "IM", notes: "Use 1:1000 solution" }
    ],
    indications: [
      "Cardiac arrest (VF/pVT after 3rd shock, PEA/Asystole immediately)",
      "Severe allergic reaction / Anaphylaxis",
      "Severe asthma exacerbation",
      "Symptomatic bradycardia (infusion)"
    ],
    contraindications: [
      "None in cardiac arrest or severe anaphylaxis",
      "Relative: Hypertension, tachyarrhythmias, ischemic heart disease"
    ],
    warnings: [
      "Tissue necrosis with extravasation",
      "Increases myocardial oxygen demand"
    ]
  }
};

export function MedicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = MEDICATIONS[id as string] || MEDICATIONS.epinephrine;

  return (
    <div className="flex flex-col min-h-full bg-[#0a0a0a] text-neutral-100 pb-24">
      
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0a0a0a]/90 backdrop-blur border-b border-[#2a2a2a] px-4 py-4 md:pt-4 pt-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-[#1a1a1a] active:bg-[#2a2a2a] transition-colors">
            <ArrowLeft className="w-5 h-5 text-neutral-300" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold leading-tight">{data.name}</h1>
            <span className="text-[10px] text-blue-400 font-bold tracking-wider uppercase">{data.altName} • {data.class}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full hover:bg-[#1a1a1a] text-neutral-400">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        
        {/* Dosage Block */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-2">
            <Pill className="w-4 h-4" /> Dosing Guidelines
          </h2>
          <div className="flex flex-col gap-3">
            {data.dosages.map((d: any, i: number) => (
              <div key={i} className="bg-[#121212] border border-[#2a2a2a] rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3">
                  <span className="bg-blue-950/40 text-blue-400 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider border border-blue-900/30">
                    {d.route}
                  </span>
                </div>
                
                <h3 className="font-semibold text-neutral-200 text-sm">{d.indication}</h3>
                <div className="flex items-end gap-2 text-blue-400 font-bold">
                  <span className="text-2xl leading-none">{d.dose}</span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">{d.notes}</p>

                {/* Quick Calc Button */}
                <button className="mt-3 w-full py-2.5 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-neutral-300 transition-colors">
                  <Calculator className="w-4 h-4 text-blue-500" />
                  Calculate Pediatric Dose
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Indications */}
        <section className="bg-emerald-950/10 border border-emerald-900/20 rounded-2xl p-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Indications
          </h2>
          <ul className="flex flex-col gap-2">
            {data.indications.map((ind: string, idx: number) => (
              <li key={idx} className="text-sm text-neutral-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 mt-1.5 shrink-0" />
                <span className="leading-snug">{ind}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Contraindications & Warnings */}
        <section className="bg-red-950/10 border border-red-900/20 rounded-2xl p-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-3 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4" /> Contraindications
          </h2>
          <ul className="flex flex-col gap-2 mb-4">
            {data.contraindications.map((ci: string, idx: number) => (
              <li key={idx} className="text-sm text-neutral-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-1.5 shrink-0" />
                <span className="leading-snug">{ci}</span>
              </li>
            ))}
          </ul>
          
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" /> Warnings
          </h2>
          <ul className="flex flex-col gap-2">
            {data.warnings.map((warn: string, idx: number) => (
              <li key={idx} className="text-sm text-neutral-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50 mt-1.5 shrink-0" />
                <span className="leading-snug">{warn}</span>
              </li>
            ))}
          </ul>
        </section>

      </div>
    </div>
  );
}
