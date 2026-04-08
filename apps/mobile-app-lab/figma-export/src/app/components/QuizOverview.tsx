import { Link, useNavigate } from "react-router";
import { ArrowLeft, Sparkles, Brain, ListChecks, ChevronRight, Search, PlayCircle, BookOpen, Clock, Store, Activity, Pill, Baby, Shuffle } from "lucide-react";
import { cn } from "../lib/utils";

export function QuizOverview() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-black text-neutral-100 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#2a2a2a]">
        <div className="flex items-center gap-3 p-4 pt-12 md:pt-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] text-neutral-400 active:scale-95 transition-transform border border-[#2a2a2a]">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white">Lerntests</h1>
            <span className="text-[11px] font-medium text-neutral-500">Wissen testen & wiederholen</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-8">
        {/* Section 1: Test starten */}
        <section className="flex flex-col gap-3">
          <TestStartCard />
        </section>

        {/* Section 2: Meine Tests */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Meine Tests</h2>
          <div className="flex flex-col gap-3">
            <TestListItem title="Advanced Life Support (ALS)" questions={15} status="begonnen" />
            <TestListItem title="Sepsis Management" questions={10} status="neu" />
            <TestListItem title="Pädiatrische Notfälle" questions={20} status="abgeschlossen" />
          </div>
        </section>

        {/* Section 3: Aus Marketplace */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Aus dem Marktplatz</h2>
          <Link to="/marketplace" className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 rounded-[2rem] p-5 flex flex-col gap-4 active:scale-[0.98] transition-transform">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <Store className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-base font-bold text-white">Tests aus Marktplatz</h3>
                <p className="text-xs text-neutral-400 mt-1 leading-snug">Erweitere dein Wissen mit verifizierten Tests von unseren Partnern und Organisationen.</p>
              </div>
            </div>
            <div className="w-full bg-[#1a1a1a] hover:bg-[#222] text-white border border-[#2a2a2a] py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 mt-1">
              Marktplatz öffnen <ChevronRight className="w-4 h-4 text-neutral-500" />
            </div>
          </Link>
        </section>

        {/* Section 4: Schnelltests */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Schnelltests</h2>
          <div className="grid grid-cols-2 gap-3">
            <QuickTestCard icon={<Activity className="text-indigo-400 w-6 h-6" />} label="Algorithmen" bgColor="bg-indigo-500/10" borderColor="border-indigo-500/20" />
            <QuickTestCard icon={<Pill className="text-emerald-400 w-6 h-6" />} label="Medikamente" bgColor="bg-emerald-500/10" borderColor="border-emerald-500/20" />
            <QuickTestCard icon={<Baby className="text-pink-400 w-6 h-6" />} label="Pädiatrie" bgColor="bg-pink-500/10" borderColor="border-pink-500/20" />
            <QuickTestCard icon={<Shuffle className="text-amber-400 w-6 h-6" />} label="Zufällig" bgColor="bg-amber-500/10" borderColor="border-amber-500/20" />
          </div>
        </section>

        {/* Section 5: Fortschritt */}
        <section className="flex flex-col gap-3 mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Test Fortschritt</h2>
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-[2rem] p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-300">Wöchentliches Ziel</span>
              <span className="text-sm font-bold text-white">3 / 5 Tests</span>
            </div>
            <div className="flex gap-1.5 h-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={cn("flex-1 rounded-sm", i <= 3 ? "bg-amber-500" : "bg-[#1a1a1a] border border-[#2a2a2a]")} />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="bg-[#1a1a1a] rounded-xl p-3 flex flex-col">
                <span className="text-[10px] uppercase font-bold text-neutral-500">Erfolgsquote</span>
                <span className="text-xl font-bold text-emerald-400">86%</span>
              </div>
              <div className="bg-[#1a1a1a] rounded-xl p-3 flex flex-col">
                <span className="text-[10px] uppercase font-bold text-neutral-500">Gelöste Fragen</span>
                <span className="text-xl font-bold text-indigo-400">142</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function TestStartCard() {
  return (
    <Link to="/tests/run/1" className="bg-gradient-to-br from-[#1c1c21] to-[#121212] rounded-[2rem] p-6 border border-indigo-900/50 flex flex-col gap-5 active:scale-[0.98] transition-transform relative overflow-hidden shadow-xl">
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex justify-between items-start relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
          <Brain className="w-7 h-7 text-indigo-400" />
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-amber-300 bg-amber-500/10 border border-amber-500/20">
          <Sparkles className="w-3 h-3" /> KI Erstellt
        </span>
      </div>
      
      <div className="relative z-10 flex flex-col gap-1">
        <h2 className="text-xl font-bold text-white tracking-tight">Neuen Test starten</h2>
        <p className="text-[13px] text-neutral-400 leading-relaxed max-w-[250px]">
          Wir erstellen einen individuellen Test basierend auf deinen letzten Nachbereitungen.
        </p>
      </div>
      
      <div className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 mt-1 relative z-10 shadow-lg shadow-indigo-900/20">
        <PlayCircle className="w-5 h-5" /> Starten
      </div>
    </Link>
  );
}

function TestListItem({ title, questions, status }: { title: string, questions: number, status: "neu" | "begonnen" | "abgeschlossen" }) {
  return (
    <Link to="/tests/run/1" className="flex items-center justify-between p-4 bg-[#121212] rounded-2xl border border-[#2a2a2a] active:scale-[0.98] transition-transform">
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 mt-0.5",
          status === "abgeschlossen" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
          status === "begonnen" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
          "bg-[#1a1a1a] border-[#2a2a2a] text-neutral-400"
        )}>
          <ListChecks className="w-5 h-5" />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="font-semibold text-neutral-200 text-[15px]">{title}</h4>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] text-neutral-500 font-medium">
              <BookOpen className="w-3 h-3" /> {questions} Fragen
            </span>
            <div className="w-1 h-1 rounded-full bg-neutral-700" />
            <span className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md", 
              status === "abgeschlossen" ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : 
              status === "begonnen" ? "text-amber-400 bg-amber-500/10 border border-amber-500/20" : 
              "text-blue-400 bg-blue-500/10 border border-blue-500/20"
            )}>
              {status}
            </span>
          </div>
        </div>
      </div>
      <div className="shrink-0 pl-2">
        <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
          <PlayCircle className="w-4 h-4 text-neutral-400" />
        </div>
      </div>
    </Link>
  );
}

function QuickTestCard({ icon, label, bgColor, borderColor }: { icon: React.ReactNode, label: string, bgColor: string, borderColor: string }) {
  return (
    <Link to="/tests/run/1" className="bg-[#121212] border border-[#2a2a2a] rounded-2xl p-4 flex flex-col gap-3 active:scale-[0.98] transition-transform">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", bgColor, borderColor)}>
        {icon}
      </div>
      <span className="font-semibold text-neutral-200 text-sm">{label}</span>
    </Link>
  );
}