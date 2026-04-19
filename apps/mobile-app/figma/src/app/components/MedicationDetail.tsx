import { ArrowLeft, Heart, Copy, AlertTriangle, Info, GitBranch, Check, Syringe, Zap, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface MedicationDetailProps {
  onBack: () => void;
}

export function MedicationDetail({ onBack }: MedicationDetailProps) {
  const [copied, setCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleCopy = () => {
    // In a real app this would write to clipboard
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-40 bg-[#09090b] flex flex-col font-sans animate-in slide-in-from-right duration-300">
      {/* Top Navigation */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4 bg-[#09090b]/90 backdrop-blur-xl border-b border-zinc-900 sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="size-11 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center active:scale-95 active:bg-zinc-800 transition-all"
        >
          <ArrowLeft className="size-6 text-zinc-300" />
        </button>
        <span className="text-zinc-400 font-semibold tracking-wide uppercase text-sm">Medication</span>
        <button className="size-11 rounded-full flex items-center justify-center invisible">
          {/* Spacer to center the title */}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-28 space-y-6">
        
        {/* Header Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-widest">
              <Syringe className="size-3.5" />
              Vasopressor
            </div>
            
            <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-md">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              Source: EMS Protocol v4.2
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">
            Epinephrine<br/>
            <span className="text-2xl text-zinc-500 font-medium">1:10,000 (0.1 mg/mL)</span>
          </h1>
        </section>

        {/* Quick Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl py-3.5 flex flex-col items-center justify-center gap-1.5 active:bg-zinc-800 active:scale-[0.98] transition-all"
          >
            <Heart className={`size-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-zinc-400'}`} />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              {isFavorite ? 'Saved' : 'Favorite'}
            </span>
          </button>

          <button 
            onClick={handleCopy}
            className="flex-[1.5] bg-sky-500/10 border border-sky-500/20 rounded-2xl py-3.5 flex flex-col items-center justify-center gap-1.5 active:bg-sky-500/20 active:scale-[0.98] transition-all"
          >
            {copied ? <Check className="size-6 text-sky-400" /> : <Copy className="size-6 text-sky-400" />}
            <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-400">
              {copied ? 'Copied' : 'Copy Reference Dose'}
            </span>
          </button>
        </div>

        {/* Indication Card */}
        <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-[1.5rem] p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Info className="size-5 text-zinc-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Indication</h2>
          </div>
          <p className="text-zinc-100 text-[17px] leading-snug font-medium">
            Cardiac arrest (VF, pVT, Asystole, PEA), severe anaphylaxis, severe asthma.
          </p>
        </section>

        {/* Dosage Card - High Contrast */}
        <section className="bg-sky-950/20 border border-sky-900/50 rounded-[1.5rem] p-5 shadow-[0_0_30px_rgba(14,165,233,0.05)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
          
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex items-center gap-2">
              <Zap className="size-5 text-sky-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-sky-400">Dosage (Adult)</h2>
            </div>
            <span className="text-[9px] uppercase tracking-widest font-bold text-sky-500/50 border border-sky-500/20 px-1.5 py-0.5 rounded">Reference Only</span>
          </div>
          
          <div className="space-y-4 relative z-10">
            <div>
              <div className="text-3xl font-bold text-white mb-1">1 mg <span className="text-xl text-sky-100 font-medium">IV/IO</span></div>
              <p className="text-sky-200/70 text-[15px] font-medium">Every 3-5 minutes during CPR.</p>
            </div>
            <div className="h-px w-full bg-sky-900/50"></div>
            <div>
              <p className="text-zinc-300 text-[15px] leading-snug">
                <strong className="text-white">Flush:</strong> Follow each dose with 20mL NS flush and elevate extremity for 10-20 seconds.
              </p>
            </div>
          </div>
        </section>

        {/* Warnings Card */}
        <section className="bg-red-950/20 border border-red-900/50 rounded-[1.5rem] p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="size-5 text-red-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-red-500">Warnings & Cautions</h2>
          </div>
          <ul className="space-y-2.5 text-[15px] text-zinc-200 leading-snug">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              Do not mix with alkaline solutions (e.g., Sodium Bicarbonate).
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              May cause myocardial ischemia, angina, or increased myocardial oxygen demand.
            </li>
          </ul>
        </section>

        {/* Related Algorithms */}
        <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-[1.5rem] p-5">
          <div className="flex items-center gap-2 mb-4">
            <GitBranch className="size-5 text-emerald-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">Related Algorithms</h2>
          </div>
          <div className="space-y-2.5">
            <button className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center justify-between active:bg-zinc-800 transition-colors group">
              <div className="flex flex-col items-start text-left">
                <span className="text-zinc-100 font-semibold text-[16px] group-active:text-white">Adult Cardiac Arrest</span>
                <span className="text-sm text-zinc-500">ACLS Protocol</span>
              </div>
              <ArrowLeft className="size-5 text-zinc-600 rotate-180 group-active:text-zinc-400 transition-colors" />
            </button>
            <button className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center justify-between active:bg-zinc-800 transition-colors group">
              <div className="flex flex-col items-start text-left">
                <span className="text-zinc-100 font-semibold text-[16px] group-active:text-white">Anaphylaxis</span>
                <span className="text-sm text-zinc-500">Allergic Reaction Protocol</span>
              </div>
              <ArrowLeft className="size-5 text-zinc-600 rotate-180 group-active:text-zinc-400 transition-colors" />
            </button>
          </div>
        </section>
        
      </div>
    </div>
  );
}
