import { useNavigate } from "react-router";
import { ArrowLeft, MessageSquare, Heart, ShieldAlert, CheckCircle2, ExternalLink } from "lucide-react";

export function Survey() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-[#0a0a0a] text-neutral-100 p-4 pt-12 md:pt-4 gap-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 mt-2">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-[#1a1a1a] active:bg-[#2a2a2a] transition-colors">
          <ArrowLeft className="w-5 h-5 text-neutral-300" />
        </button>
        <h1 className="text-xl font-bold leading-tight">Feedback & Survey</h1>
      </div>

      <div className="flex flex-col flex-1 items-center justify-center -mt-12 text-center max-w-sm mx-auto">
        <div className="w-20 h-20 bg-red-950/30 rounded-full flex items-center justify-center mb-6 border border-red-900/30">
          <MessageSquare className="w-10 h-10 text-red-500" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Help shape ResQBrain</h2>
        <p className="text-neutral-400 text-base mb-8 px-4 leading-relaxed">
          We're currently in the MVP phase. Your feedback directly influences how fast we can improve the app for emergency medical services.
        </p>

        <div className="flex flex-col gap-4 w-full mb-10 bg-[#121212] p-5 rounded-2xl border border-[#2a2a2a] text-left">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-2">What we're looking for:</h3>
          <FeatureRow icon={<ShieldAlert className="w-4 h-4 text-emerald-500" />} text="Missing protocols or algorithms" />
          <FeatureRow icon={<CheckCircle2 className="w-4 h-4 text-blue-500" />} text="UI & readability in stressful situations" />
          <FeatureRow icon={<Heart className="w-4 h-4 text-red-500" />} text="General usage feedback & feature requests" />
        </div>

        <button className="w-full py-4 bg-white hover:bg-neutral-200 text-black font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
          Participate in Survey <ExternalLink className="w-4 h-4" />
        </button>
        <p className="text-xs text-neutral-600 mt-4 flex items-center justify-center gap-1">
          Takes ~2 minutes. Anonymous and secure.
        </p>
      </div>
    </div>
  );
}

function FeatureRow({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-neutral-300">
      <div className="shrink-0">{icon}</div>
      <p>{text}</p>
    </div>
  );
}
