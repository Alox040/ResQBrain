import { useState } from 'react';
import { ShieldAlert, BookOpen, Calculator, Check } from 'lucide-react';

interface OnboardingScreenProps {
  onAccept: () => void;
}

export function OnboardingScreen({ onAccept }: OnboardingScreenProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] bg-[#09090b] flex flex-col items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-[420px] bg-zinc-900/90 backdrop-blur-xl border border-zinc-800/80 rounded-[2rem] p-6 shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Subtle top highlight */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent opacity-50"></div>

        {/* Header */}
        <div className="mb-8">
          <div className="size-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 shadow-inner">
            <ShieldAlert className="size-6 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight mb-3">
            Nutzungshinweis
          </h1>
          <p className="text-[17px] leading-relaxed text-zinc-400 font-medium">
            ResQBrain ist ein statisches Nachschlagewerk. Es ersetzt keine klinische Einschätzung.
          </p>
        </div>

        {/* Bullets */}
        <div className="space-y-6 mb-10">
          {[
            { icon: ShieldAlert, title: 'Reine Referenz', desc: 'Keine diagnostische Entscheidungshilfe.' },
            { icon: BookOpen, title: 'Lokale SOPs', desc: 'Regionale Leitlinien haben immer Vorrang.' },
            { icon: Calculator, title: 'Statischer Inhalt', desc: 'Keine patientenspezifischen Rechner.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="mt-0.5 size-10 rounded-full bg-zinc-950 border border-zinc-800/80 flex items-center justify-center shrink-0 shadow-sm">
                <item.icon className="size-5 text-zinc-400" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[17px] font-bold text-zinc-200">{item.title}</h3>
                <p className="text-[15px] text-zinc-500 leading-snug mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto space-y-5">
          {/* Checkbox (Large Touch Target) */}
          <button
            onClick={() => setAccepted(!accepted)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 active:bg-zinc-900/80 active:scale-[0.98] transition-all text-left group shadow-inner"
          >
            <div className={`size-7 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
              accepted 
                ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' 
                : 'bg-zinc-900 border-zinc-700 group-active:border-zinc-500'
            }`}>
              {accepted && <Check className="size-[18px] text-zinc-950 stroke-[3]" />}
            </div>
            <span className={`text-[15px] font-bold leading-snug transition-colors ${
              accepted ? 'text-zinc-200' : 'text-zinc-400 group-active:text-zinc-300'
            }`}>
              Ich bin qualifiziertes Personal und verstehe die Einschränkungen.
            </span>
          </button>

          {/* CTA */}
          <button
            disabled={!accepted}
            onClick={onAccept}
            className={`w-full py-4 rounded-2xl text-[17px] font-bold transition-all ${
              accepted
                ? 'bg-zinc-100 text-zinc-950 active:scale-[0.98] shadow-[0_4px_16px_rgba(255,255,255,0.15)] hover:bg-white'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-70'
            }`}
          >
            Zustimmen & Fortfahren
          </button>
        </div>
      </div>
    </div>
  );
}