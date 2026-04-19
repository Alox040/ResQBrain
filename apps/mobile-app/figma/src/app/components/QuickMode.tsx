import { Zap, Activity, Pill, BookOpen, Heart, X } from 'lucide-react';

interface QuickModeProps {
  onClose: () => void;
  onOpenAlgorithms: () => void;
  onOpenMedications: () => void;
  onOpenProtocols: () => void;
  onOpenFavorites: () => void;
}

export function QuickMode({ 
  onClose, 
  onOpenAlgorithms, 
  onOpenMedications, 
  onOpenProtocols, 
  onOpenFavorites 
}: QuickModeProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col font-sans animate-in fade-in zoom-in-95 duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-14 pb-4">
        <div className="flex items-center gap-3 text-red-500 bg-red-500/10 px-4 py-2.5 rounded-full border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
          <Zap className="size-5 fill-red-500 animate-pulse" />
          <span className="font-bold tracking-widest uppercase text-[13px]">Quick Mode</span>
        </div>
        <button 
          onClick={onClose} 
          className="size-14 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 active:bg-zinc-800 active:scale-95 transition-all"
        >
          <X className="size-7 text-zinc-300" />
        </button>
      </div>

      {/* Massive 2x2 Grid */}
      <div className="flex-1 p-5 pb-10 flex flex-col gap-5">
        <div className="flex-1 grid grid-cols-2 gap-5">
          
          <button 
            onClick={onOpenAlgorithms} 
            className="bg-emerald-950/30 border-2 border-emerald-500/40 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 active:bg-emerald-900/60 active:border-emerald-500 active:scale-[0.98] transition-all"
          >
            <Activity className="size-20 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]" />
            <span className="text-lg font-black text-emerald-400 uppercase tracking-widest drop-shadow-md">
              Algorithms
            </span>
          </button>

          <button 
            onClick={onOpenMedications} 
            className="bg-cyan-950/30 border-2 border-cyan-500/40 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 active:bg-cyan-900/60 active:border-cyan-500 active:scale-[0.98] transition-all"
          >
            <Pill className="size-20 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]" />
            <span className="text-lg font-black text-cyan-400 uppercase tracking-widest drop-shadow-md">
              Meds
            </span>
          </button>

          <button 
            onClick={onOpenProtocols} 
            className="bg-purple-950/30 border-2 border-purple-500/40 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 active:bg-purple-900/60 active:border-purple-500 active:scale-[0.98] transition-all"
          >
            <BookOpen className="size-20 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]" />
            <span className="text-lg font-black text-purple-400 uppercase tracking-widest drop-shadow-md">
              Protocols
            </span>
          </button>

          <button 
            onClick={onOpenFavorites} 
            className="bg-red-950/30 border-2 border-red-500/40 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 active:bg-red-900/60 active:border-red-500 active:scale-[0.98] transition-all"
          >
            <Heart className="size-20 text-red-500 fill-red-500/20 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]" />
            <span className="text-lg font-black text-red-500 uppercase tracking-widest drop-shadow-md">
              Favorites
            </span>
          </button>

        </div>
      </div>
    </div>
  );
}