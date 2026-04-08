import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Bookmark, Share2 } from "lucide-react";
import { cn } from "../lib/utils";

// Mock Data
const ALGORITHMS: Record<string, any> = {
  anaphylaxis: {
    title: "Anaphylaxis (Adult)",
    version: "ERC 2021",
    steps: [
      { id: 1, title: "Assess ABCDE", desc: "Airway, Breathing, Circulation, Disability, Exposure.", type: "action" },
      { id: 2, title: "Administer Adrenalin IM", desc: "0.5mg IM (0.5ml of 1:1000) in anterolateral thigh.", type: "critical" },
      { id: 3, title: "Establish Airway / O2", desc: "High flow oxygen 15L/min via non-rebreather mask.", type: "action" },
      { id: 4, title: "IV Fluid Challenge", desc: "500-1000ml crystalloid rapidly if hypotensive.", type: "action" }
    ],
    notes: [
      "Repeat IM adrenalin every 5 min if no improvement.",
      "Consider antihistamine (Chlorphenamine 10mg IV) and steroid (Hydrocortisone 200mg IV) after initial resuscitation.",
      "Observe for biphasic reaction."
    ]
  }
};

export function AlgorithmDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = ALGORITHMS[id as string] || ALGORITHMS.anaphylaxis;

  const [expandedNotes, setExpandedNotes] = useState(false);

  return (
    <div className="flex flex-col min-h-full bg-[#0a0a0a] text-neutral-100 pb-24">
      
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0a0a0a]/90 backdrop-blur border-b border-[#2a2a2a] px-4 py-4 md:pt-4 pt-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-[#1a1a1a] active:bg-[#2a2a2a] transition-colors">
            <ArrowLeft className="w-5 h-5 text-neutral-300" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold leading-tight">{data.title}</h1>
            <span className="text-[10px] text-red-400 font-bold tracking-wider uppercase">{data.version}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full hover:bg-[#1a1a1a] text-neutral-400">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Steps List */}
      <div className="p-4 flex flex-col gap-3 relative">
        {/* Timeline Line */}
        <div className="absolute left-[31px] top-8 bottom-8 w-0.5 bg-[#2a2a2a] z-0" />

        {data.steps.map((step: any, index: number) => (
          <div key={step.id} className="flex gap-4 relative z-10">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-4 border-[#0a0a0a] font-bold text-xs",
              step.type === "critical" ? "bg-red-500 text-white" : "bg-[#1a1a1a] text-neutral-300 border-[#2a2a2a]"
            )}>
              {index + 1}
            </div>
            
            <div className={cn(
              "flex-1 p-4 rounded-2xl border",
              step.type === "critical" 
                ? "bg-red-950/20 border-red-900/50" 
                : "bg-[#121212] border-[#2a2a2a]"
            )}>
              <h3 className="font-semibold text-sm mb-1 text-white flex items-center gap-2">
                {step.type === "critical" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                {step.title}
              </h3>
              <p className="text-sm text-neutral-400 leading-snug">{step.desc}</p>
              
              {step.type === "critical" && (
                <button className="mt-3 w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors">
                  <CheckCircle2 className="w-4 h-4" /> Log Action
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Expandable Notes Section */}
      <div className="px-4 mt-2">
        <button 
          onClick={() => setExpandedNotes(!expandedNotes)}
          className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] rounded-t-2xl border border-[#2a2a2a] border-b-0"
        >
          <span className="font-semibold text-sm text-neutral-200">Clinical Notes & Dosing</span>
          {expandedNotes ? <ChevronUp className="w-5 h-5 text-neutral-500" /> : <ChevronDown className="w-5 h-5 text-neutral-500" />}
        </button>
        
        {expandedNotes && (
          <div className="p-4 bg-[#121212] border border-[#2a2a2a] border-t-0 rounded-b-2xl flex flex-col gap-3">
            {data.notes.map((note: string, idx: number) => (
              <div key={idx} className="flex gap-3 text-sm text-neutral-400">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 shrink-0 mt-1.5" />
                <p className="leading-snug">{note}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Jump FAB (Simulated) */}
      <div className="fixed bottom-24 right-4 z-30">
        <button className="w-12 h-12 bg-neutral-800 rounded-full shadow-lg border border-neutral-700 flex items-center justify-center text-neutral-300 hover:bg-neutral-700 transition-colors">
          <ChevronUp className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
}
