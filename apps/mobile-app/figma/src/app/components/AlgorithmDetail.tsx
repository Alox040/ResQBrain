import { ArrowLeft, CheckCircle2, Heart, ShieldCheck, AlertTriangle, Activity } from 'lucide-react';
import { useState } from 'react';

interface AlgorithmDetailProps {
  onBack: () => void;
}

export function AlgorithmDetail({ onBack }: AlgorithmDetailProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const steps = [
    {
      id: 1,
      title: 'Verify & Activate',
      text: 'Verify scene safety. Check for responsiveness. Shout for nearby help and activate emergency response system. Get AED/defibrillator.',
      warning: null,
    },
    {
      id: 2,
      title: 'High-Quality CPR',
      text: 'Begin CPR immediately. Push hard (≥2 inches) and fast (100-120/min). Allow complete chest recoil. Minimize interruptions.',
      warning: 'Do not interrupt compressions for more than 10 seconds.',
    },
    {
      id: 3,
      title: 'Check Rhythm',
      text: 'Attach monitor/defibrillator pads. Check rhythm. Is it shockable (VF/pVT)?',
      warning: null,
    },
    {
      id: 4,
      title: 'Shock & Resume',
      text: 'Deliver 1 shock. Immediately resume CPR for 2 minutes (do not check pulse). Establish IV/IO access.',
      warning: 'Clear the patient before delivering shock.',
    },
    {
      id: 5,
      title: 'Administer Medications',
      text: 'Epinephrine 1 mg IV/IO every 3-5 minutes. Consider Amiodarone 300 mg bolus for refractory VF/pVT.',
      warning: null,
    },
  ];

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
        <span className="text-zinc-400 font-semibold tracking-wide uppercase text-sm">Algorithm</span>
        <button className="size-11 rounded-full flex items-center justify-center invisible">
          {/* Spacer to center the title */}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-40">
        
        {/* Header Section */}
        <section className="mb-8 space-y-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <Activity className="size-3.5" />
              Cardiac
            </div>
            
            <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-md">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              AHA Guidelines 2020
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">
            Adult Cardiac Arrest
          </h1>
          <p className="text-zinc-400 text-[15px] font-medium">
            Advanced Cardiovascular Life Support (ACLS)
          </p>
        </section>

        {/* Steps List */}
        <section className="space-y-4">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="bg-zinc-900/60 border border-zinc-800/80 rounded-[1.5rem] p-5 shadow-sm relative overflow-hidden"
            >
              {/* Step indicator line connecting steps conceptually */}
              {step.id !== steps.length && (
                <div className="absolute left-[39px] top-16 bottom-[-20px] w-0.5 bg-zinc-800/50 z-0 hidden"></div>
              )}
              
              <div className="flex gap-4 relative z-10">
                {/* Number Badge */}
                <div className="size-[38px] rounded-full bg-zinc-950 border border-emerald-500/30 text-emerald-400 font-bold text-lg flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
                  {step.id}
                </div>
                
                {/* Step Content */}
                <div className="flex-1 pt-1.5">
                  <h3 className="text-lg font-bold text-zinc-100 mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-zinc-400 text-[16px] leading-relaxed font-medium">
                    {step.text}
                  </p>
                  
                  {/* Warning Highlight */}
                  {step.warning && (
                    <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 flex items-start gap-3">
                      <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-amber-200/90 text-sm font-semibold leading-snug">
                        {step.warning}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Bottom Fixed Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#09090b]/95 backdrop-blur-xl border-t border-zinc-900 p-5 pb-safe z-20">
        <div className="flex gap-3 max-w-md mx-auto">
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl py-3.5 flex flex-col items-center justify-center gap-1.5 active:bg-zinc-800 active:scale-[0.98] transition-all"
          >
            <Heart className={`size-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-zinc-400'}`} />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              {isFavorite ? 'Saved' : 'Save Algorithm'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
