import { GitBranch, ChevronRight, Activity, Zap, HeartPulse } from 'lucide-react';
import { useState } from 'react';

interface AlgorithmsTabProps {
  onSelectAlgorithm: (id: string) => void;
}

export function AlgorithmsTab({ onSelectAlgorithm }: AlgorithmsTabProps) {
  const algorithms = [
    { id: 'cardiac', title: 'Adult Cardiac Arrest', group: 'Resuscitation', icon: Activity, color: 'text-emerald-400' },
    { id: 'tachycardia', title: 'Tachycardia with Pulse', group: 'Cardiac', icon: HeartPulse, color: 'text-amber-400' },
    { id: 'bradycardia', title: 'Symptomatic Bradycardia', group: 'Cardiac', icon: HeartPulse, color: 'text-amber-400' },
    { id: 'anaphylaxis', title: 'Anaphylaxis', group: 'Medical', icon: Zap, color: 'text-sky-400' },
    { id: 'stroke', title: 'Suspected Stroke', group: 'Neurological', icon: Activity, color: 'text-purple-400' },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-5 pb-32 animate-in fade-in duration-200">
      <header className="pt-12 pb-6 space-y-5 sticky top-0 bg-[#09090b]/95 backdrop-blur-xl z-10 border-b border-zinc-900/50">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Algorithms</h1>
          <p className="text-zinc-500 text-[15px] font-medium">Standardized response paths</p>
        </div>
      </header>

      <div className="pt-6 space-y-3">
        {algorithms.map((algo) => (
          <button
            key={algo.id}
            onClick={() => onSelectAlgorithm(algo.id)}
            className="w-full bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 flex items-center justify-between active:bg-zinc-800 active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={`size-12 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-center shadow-inner group-active:border-zinc-700 transition-colors`}>
                <algo.icon className={`size-6 ${algo.color}`} />
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="text-zinc-100 font-bold text-[17px] leading-snug group-active:text-white">{algo.title}</span>
                <span className="text-[14px] text-zinc-500 font-medium">{algo.group}</span>
              </div>
            </div>
            <div className="flex items-center">
              <ChevronRight className="size-5 text-zinc-600 group-active:text-zinc-400 transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}