import { Link } from "react-router";
import { BookOpen, ClipboardList, CheckCircle2, ChevronRight, Brain, Star, Clock, Sparkles, ListChecks } from "lucide-react";
import { cn } from "../lib/utils";

export function LearnOverview() {
  return (
    <div className="flex flex-col min-h-full bg-black text-neutral-100 p-4 pt-12 md:pt-4 gap-8">
      
      {/* Header */}
      <header className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
          <Brain className="w-8 h-8 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Nachbereitung</h1>
          <p className="text-sm text-indigo-300 font-medium mt-1">Lernen & Reflektieren</p>
        </div>
      </header>

      {/* Primary Action - Start Review */}
      <Link to="/learn/review/new" className="block w-full">
        <div className="w-full bg-[#16161a] rounded-[2rem] p-5 border border-indigo-900/30 flex items-center gap-5 active:scale-[0.98] transition-transform relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none" />
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/30">
            <ClipboardList className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white tracking-tight">Einsatz nachbereiten</h2>
            <p className="text-xs text-neutral-400 mt-1">Strukturierte Einsatzreflexion starten</p>
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-500" />
        </div>
      </Link>

      {/* Quick Actions */}
      <div className="flex flex-col gap-3">
        <ActionCard to="/learn/review/new" icon={<ClipboardList className="w-5 h-5 text-indigo-400" />} title="Neue Nachbereitung" subtitle="Strukturierte Reflexion" />
        <ActionCard to="/learn/mode" icon={<Brain className="w-5 h-5 text-emerald-400" />} title="Lernmodus starten" subtitle="Protokolle durchgehen" />
        <ActionCard to="/tests" icon={<ListChecks className="w-5 h-5 text-amber-400" />} title="Lerntests" subtitle="Wissen überprüfen" />
      </div>

      {/* Recent Reviews */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Letzte Nachbereitungen</h2>
          <Link to="/reviews" className="text-xs font-medium text-amber-500">Alle ansehen</Link>
        </div>
        <div className="flex flex-col gap-3">
          <ReviewCard title="Reanimation B-Straße" date="Heute, 14:30" status="offen" />
          <ReviewCard title="Anaphylaxie Restaurant" date="Gestern, 19:15" status="abgeschlossen" />
          <ReviewCard title="Verkehrsunfall A7" date="12. Mai, 08:45" status="abgeschlossen" />
        </div>
      </section>

      {/* Learning Areas */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Lernbereiche</h2>
        <div className="grid grid-cols-2 gap-3">
          <LearningCard to="/learn/mode" icon={<BookOpen className="w-6 h-6 text-emerald-400" />} title="Algorithmen" subtitle="Protokolle üben" bgColor="bg-emerald-950/20" borderColor="border-emerald-900/30" />
          <LearningCard to="/learn/mode" icon={<Star className="w-6 h-6 text-amber-400" />} title="Favoriten" subtitle="Wichtige Themen" bgColor="bg-amber-950/20" borderColor="border-amber-900/30" />
          <LearningCard to="/learn/mode" icon={<Clock className="w-6 h-6 text-blue-400" />} title="Zuletzt" subtitle="Angesehene Themen" bgColor="bg-blue-950/20" borderColor="border-blue-900/30" />
          <LearningCard to="/learn/mode" icon={<Sparkles className="w-6 h-6 text-purple-400" />} title="Eigene Notizen" subtitle="Wissen festhalten" bgColor="bg-purple-950/20" borderColor="border-purple-900/30" />
        </div>
      </section>

      {/* Progress Card (Placeholder) */}
      <section className="flex flex-col gap-4 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Dein Lernfortschritt</h2>
        <div className="w-full bg-[#121212] rounded-2xl p-5 border border-[#2a2a2a] flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-neutral-300">Level 4: Advanced Provider</span>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md">Kommt bald</span>
          </div>
          <div className="h-2 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
            <div className="h-full bg-neutral-700 w-[60%] rounded-full" />
          </div>
          <p className="text-xs text-neutral-500 mt-1">Basierend auf abgeschlossenen Nachbereitungen und Lernzeit.</p>
        </div>
      </section>

    </div>
  );
}

// Reusable Components

function ActionCard({ to, icon, title, subtitle }: { to: string, icon: React.ReactNode, title: string, subtitle: string }) {
  return (
    <Link to={to} className="flex items-center justify-between p-4 bg-[#121212] rounded-2xl border border-[#2a2a2a] active:scale-[0.98] transition-transform">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] flex items-center justify-center border border-[#2a2a2a]">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-neutral-200">{title}</span>
          <span className="text-xs text-neutral-500 mt-0.5">{subtitle}</span>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-neutral-600" />
    </Link>
  );
}

function ReviewCard({ title, date, status }: { title: string, date: string, status: "offen" | "abgeschlossen" }) {
  const isOpen = status === "offen";
  return (
    <Link to="/learn/review/detail" className="flex items-center justify-between p-4 bg-[#121212] rounded-2xl border border-[#2a2a2a] active:scale-[0.98] transition-transform">
      <div className="flex flex-col gap-1.5">
        <h4 className="font-medium text-neutral-200">{title}</h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">{date}</span>
          <div className="w-1 h-1 rounded-full bg-neutral-700" />
          <span className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md", 
            isOpen ? "text-amber-400 bg-amber-500/10" : "text-emerald-400 bg-emerald-500/10"
          )}>
            {status}
          </span>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-neutral-600" />
    </Link>
  );
}

function LearningCard({ to, icon, title, subtitle, bgColor, borderColor }: { to: string, icon: React.ReactNode, title: string, subtitle: string, bgColor: string, borderColor: string }) {
  return (
    <Link to={to} className={cn("flex flex-col gap-3 p-4 rounded-2xl border active:scale-[0.98] transition-all bg-[#121212]", borderColor)}>
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", bgColor)}>
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-neutral-200 text-sm">{title}</h3>
        <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>
      </div>
    </Link>
  );
}
