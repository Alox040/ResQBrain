import { useState } from "react";
import { Link } from "react-router";
import { 
  Play, 
  ChevronRight, 
  ClipboardList, 
  Brain, 
  Shuffle, 
  Star, 
  Plus,
  BookOpen,
  CalendarDays,
  Activity,
  Award
} from "lucide-react";
import { cn } from "../lib/utils";

export function Dashboard() {
  const [hasData, setHasData] = useState(true);

  return (
    <div className="flex flex-col min-h-full bg-black text-neutral-100 p-4 pt-12 md:pt-4 gap-8 pb-24">
      
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-sm text-neutral-400 font-medium mt-1">Lernen & Fortschritt</p>
        </div>
        {/* Toggle for demo purposes */}
        <button 
          onClick={() => setHasData(!hasData)} 
          className="px-3 py-1.5 rounded-full bg-[#1a1a1a] text-xs font-medium text-neutral-400 border border-[#2a2a2a] active:scale-95 transition-transform"
        >
          {hasData ? "Zeige Leerzustand" : "Zeige Daten"}
        </button>
      </header>

      {/* 1. Heute lernen */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Heute lernen</h2>
        {hasData ? (
          <ContinueLearningCard 
            title="Pädiatrische Reanimation" 
            type="Algorithmus" 
            to="/algorithm/pediatric-cpr"
          />
        ) : (
          <EmptyStateCard 
            title="Noch keine Inhalte" 
            description="Starte deinen ersten Algorithmus, um hier weiterzulernen." 
            actionLabel="Inhalte entdecken"
            to="/search"
          />
        )}
      </section>

      {/* 2. Offene Nachbereitungen */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Offene Nachbereitungen</h2>
        {hasData ? (
          <div className="flex flex-col gap-3">
            <ReviewListCard title="Reanimation B-Straße" date="Heute, 14:30" to="/learn/review/1" />
            <ReviewListCard title="Verkehrsunfall A7" date="Gestern, 08:45" to="/learn/review/2" />
          </div>
        ) : (
          <EmptyStateCard 
            title="Alles erledigt" 
            description="Du hast keine offenen Nachbereitungen." 
            actionLabel="Neue Nachbereitung"
            to="/learn/review/new"
          />
        )}
      </section>

      {/* 3. Lernaktivität */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Lernaktivität</h2>
        {hasData ? (
          <div className="grid grid-cols-2 gap-3">
            <DashboardStatCard icon={<ClipboardList className="w-5 h-5 text-indigo-400" />} value="3" label="Nachbereitungen diese Woche" />
            <DashboardStatCard icon={<BookOpen className="w-5 h-5 text-emerald-400" />} value="12" label="Gelernte Algorithmen" />
            <DashboardStatCard icon={<Activity className="w-5 h-5 text-amber-400" />} value="45" label="Wiederholungen gesamt" />
            <DashboardStatCard icon={<Star className="w-5 h-5 text-yellow-400" />} value="8" label="Gespeicherte Favoriten" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 opacity-50">
            <DashboardStatCard icon={<ClipboardList className="w-5 h-5 text-indigo-400" />} value="0" label="Nachbereitungen diese Woche" />
            <DashboardStatCard icon={<BookOpen className="w-5 h-5 text-emerald-400" />} value="0" label="Gelernte Algorithmen" />
            <DashboardStatCard icon={<Activity className="w-5 h-5 text-amber-400" />} value="0" label="Wiederholungen gesamt" />
            <DashboardStatCard icon={<Star className="w-5 h-5 text-yellow-400" />} value="0" label="Gespeicherte Favoriten" />
          </div>
        )}
      </section>

      {/* 4. Schnelle Aktionen */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Schnelle Aktionen</h2>
        <div className="grid grid-cols-2 gap-3">
          <QuickActionCard icon={<ClipboardList className="w-5 h-5 text-indigo-400" />} label="Nachbereitung starten" to="/learn/review/new" />
          <QuickActionCard icon={<Brain className="w-5 h-5 text-purple-400" />} label="Lernmodus" to="/learn/mode" />
          <QuickActionCard icon={<Shuffle className="w-5 h-5 text-pink-400" />} label="Zufälliger Algorithmus" to="/search" />
          <QuickActionCard icon={<Star className="w-5 h-5 text-yellow-400" />} label="Favoriten lernen" to="/learn/mode" />
        </div>
      </section>

      {/* 5. Notizen / Erkenntnisse */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Letzte Erkenntnisse</h2>
        {hasData ? (
          <NotesCard notes={[
            "Bei CPR auf frühe i.o. Anlage achten, wenn venös schwierig.",
            "Amiodaron Dosis bei pädiatrischer Reanimation wiederholen."
          ]} />
        ) : (
          <NotesCard notes={[]} />
        )}
      </section>

      {/* 6. Fortschritt (placeholder) */}
      <section className="flex flex-col gap-4 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Fortschritt</h2>
        <ProgressCard />
      </section>

    </div>
  );
}

// Reusable Components

function ContinueLearningCard({ title, type, to }: { title: string, type: string, to: string }) {
  return (
    <div className="w-full bg-gradient-to-br from-[#16161a] to-[#121215] rounded-2xl p-5 border border-indigo-900/30 flex flex-col gap-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
      
      <div className="flex flex-col gap-1 relative z-10">
        <h3 className="text-lg font-bold text-white tracking-tight">Weiterlernen</h3>
        <p className="text-xs text-indigo-300">Letzte Inhalte fortsetzen</p>
      </div>

      <div className="bg-[#0a0a0c] rounded-xl p-3 border border-white/5 flex items-center justify-between relative z-10">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-neutral-200">{title}</span>
          <span className="text-[10px] uppercase tracking-wider text-neutral-500">{type}</span>
        </div>
        <Link to={to} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors active:scale-95">
          <Play className="w-3.5 h-3.5 fill-current" /> Fortsetzen
        </Link>
      </div>
    </div>
  );
}

function ReviewListCard({ title, date, to }: { title: string, date: string, to: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#121212] rounded-2xl border border-[#2a2a2a]">
      <div className="flex flex-col gap-1.5">
        <h4 className="font-medium text-neutral-200 text-sm">{title}</h4>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-xs text-neutral-500">{date}</span>
          <div className="w-1 h-1 rounded-full bg-neutral-700" />
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md text-amber-400 bg-amber-500/10">
            Offen
          </span>
        </div>
      </div>
      <Link to={to} className="flex items-center gap-1 text-xs font-medium text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg active:scale-95 transition-transform">
        Weiter <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

function DashboardStatCard({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <div className="bg-[#121212] rounded-2xl border border-[#2a2a2a] p-4 flex flex-col gap-3">
      <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-white leading-none">{value}</span>
        <span className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1 leading-tight">{label}</span>
      </div>
    </div>
  );
}

function QuickActionCard({ icon, label, to }: { icon: React.ReactNode, label: string, to: string }) {
  return (
    <Link to={to} className="flex flex-col gap-3 p-4 bg-[#121212] rounded-2xl border border-[#2a2a2a] active:scale-[0.98] transition-transform">
      <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center">
        {icon}
      </div>
      <span className="text-xs font-medium text-neutral-300">{label}</span>
    </Link>
  );
}

function NotesCard({ notes }: { notes: string[] }) {
  return (
    <div className="bg-[#121212] rounded-2xl border border-[#2a2a2a] overflow-hidden">
      {notes.length > 0 ? (
        <div className="flex flex-col divide-y divide-[#2a2a2a]">
          {notes.map((note, idx) => (
            <div key={idx} className="p-4 text-sm text-neutral-300 leading-relaxed">
              {note}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-sm text-neutral-500">
          Noch keine Erkenntnisse festgehalten.
        </div>
      )}
      <div className="p-3 bg-[#16161a] border-t border-[#2a2a2a]">
        <button className="w-full flex items-center justify-center gap-2 text-xs font-medium text-indigo-400 py-2 rounded-xl hover:bg-indigo-500/10 transition-colors">
          <Plus className="w-4 h-4" /> Neue Notiz
        </button>
      </div>
    </div>
  );
}

function ProgressCard() {
  return (
    <div className="bg-[#121212] rounded-2xl border border-[#2a2a2a] p-5 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-semibold text-neutral-200">Lernfortschritt</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md text-indigo-400 bg-indigo-500/10">
          In Arbeit
        </span>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">Level 2</span>
            <span className="text-neutral-400">120 / 500 XP</span>
          </div>
          <div className="h-2 w-full bg-[#1a1a1a] rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-[24%] rounded-full" />
          </div>
        </div>
        
        <div className="flex justify-between mt-2 pt-3 border-t border-[#2a2a2a]">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-neutral-300">12</span>
            <span className="text-[10px] text-neutral-500">Wiederholungen</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-neutral-300">3 Tage</span>
            <span className="text-[10px] text-neutral-500">Aktivität</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-neutral-300">4</span>
            <span className="text-[10px] text-neutral-500">Reviews</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyStateCard({ title, description, actionLabel, to }: { title: string, description: string, actionLabel: string, to: string }) {
  return (
    <div className="bg-[#121212] rounded-2xl border border-[#2a2a2a] border-dashed p-6 flex flex-col items-center justify-center text-center gap-3">
      <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-1">
        <BookOpen className="w-5 h-5 text-neutral-600" />
      </div>
      <h3 className="text-sm font-semibold text-neutral-200">{title}</h3>
      <p className="text-xs text-neutral-500 max-w-[200px]">{description}</p>
      <Link to={to} className="mt-2 text-xs font-medium text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-xl active:scale-95 transition-transform">
        {actionLabel}
      </Link>
    </div>
  );
}
