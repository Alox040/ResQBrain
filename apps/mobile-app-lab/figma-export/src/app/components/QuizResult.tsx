import { useNavigate } from "react-router";
import { CheckCircle2, Award, ArrowRight, RotateCcw, Home, Brain } from "lucide-react";

export function QuizResult() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-black text-neutral-100 justify-center items-center pb-24 p-6 relative">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-black pointer-events-none" />

      {/* Main Card */}
      <div className="w-full bg-[#121212] border border-[#2a2a2a] rounded-[2.5rem] p-8 flex flex-col items-center text-center gap-6 relative z-10 shadow-2xl shadow-indigo-900/10">
        
        {/* Trophy Icon */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.3)] mb-2 relative">
          <div className="absolute inset-0 border-4 border-black rounded-full" />
          <Award className="w-12 h-12 text-white" />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Gut gemacht!</h1>
          <p className="text-sm text-neutral-400">
            Du hast den Lerntest <strong className="text-indigo-400">Advanced Life Support</strong> erfolgreich abgeschlossen.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-2 gap-3 mt-4">
          <div className="bg-[#1a1a1a] rounded-2xl p-4 flex flex-col items-center border border-[#2a2a2a]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 mb-1">Richtig</span>
            <span className="text-3xl font-black text-emerald-400">8<span className="text-sm text-neutral-600">/10</span></span>
          </div>
          <div className="bg-[#1a1a1a] rounded-2xl p-4 flex flex-col items-center border border-[#2a2a2a]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 mb-1">Zeit</span>
            <span className="text-3xl font-black text-indigo-400">4<span className="text-sm text-neutral-600">m</span></span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3 mt-6">
          <button 
            onClick={() => navigate('/tests')}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl text-[15px] font-bold transition-all shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            Zurück zu Lerntests <ArrowRight className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => navigate('/tests/run/1')}
            className="w-full bg-[#1a1a1a] hover:bg-[#222] text-neutral-300 py-3.5 rounded-xl text-[15px] font-bold transition-all border border-[#2a2a2a] flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <RotateCcw className="w-4 h-4" /> Test wiederholen
          </button>

          <button 
            onClick={() => navigate('/')}
            className="w-full bg-transparent text-neutral-500 py-3.5 rounded-xl text-sm font-semibold transition-all hover:text-neutral-300 flex items-center justify-center gap-2 active:scale-[0.98] mt-2"
          >
            <Home className="w-4 h-4" /> Zurück zum Start
          </button>
        </div>
      </div>
    </div>
  );
}