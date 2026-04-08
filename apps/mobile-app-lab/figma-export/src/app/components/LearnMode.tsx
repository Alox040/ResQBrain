import { Link, useNavigate } from "react-router";
import { ArrowLeft, BookOpen, Star, Clock, Shuffle, ChevronRight, GraduationCap } from "lucide-react";
import { cn } from "../lib/utils";

export function LearnMode() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-black text-neutral-100 p-4 pt-12 md:pt-4 gap-8">
      
      {/* Header */}
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] text-neutral-400 active:scale-95 transition-transform shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Lernmodus</h1>
          <p className="text-sm text-neutral-400 font-medium mt-0.5">Wissen vertiefen & trainieren</p>
        </div>
      </header>

      {/* Main Action - Random Topic */}
      <Link to="/search" className="block w-full">
        <div className="w-full bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-[2rem] p-6 border border-indigo-500/30 flex items-center justify-between active:scale-[0.98] transition-transform relative overflow-hidden">
          <div className="flex flex-col gap-2 relative z-10">
            <div className="flex items-center gap-2 text-indigo-300">
              <Shuffle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Quick Quiz</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Zufälliges Thema</h2>
            <p className="text-sm text-indigo-200/70 max-w-[200px]">Teste dein Wissen mit einem zufälligen Algorithmus.</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-400/30 relative z-10 backdrop-blur-sm">
            <GraduationCap className="w-8 h-8 text-indigo-300" />
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
        </div>
      </Link>

      {/* Sections */}
      <div className="flex flex-col gap-8">
        
        {/* Zuletzt angesehen */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Zuletzt angesehen
          </h2>
          <div className="flex flex-col gap-2">
            <LearnListItem title="Pädiatrische Reanimation" category="Algorithmus" to="/algorithm/pediatric-cpr" />
            <LearnListItem title="Amiodaron" category="Medikament" to="/medication/amiodarone" />
            <LearnListItem title="Anaphylaxie" category="Algorithmus" to="/algorithm/anaphylaxis" />
          </div>
        </section>

        {/* Favoriten */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
            <Star className="w-4 h-4" /> Deine Favoriten
          </h2>
          <div className="flex flex-col gap-2">
            <LearnListItem title="ACS (Akutes Koronarsyndrom)" category="Algorithmus" to="/algorithm/acs" />
            <LearnListItem title="Epinephrin (Adrenalin)" category="Medikament" to="/medication/epinephrine" />
          </div>
        </section>

        {/* Kategorien Wiederholen */}
        <section className="flex flex-col gap-4 mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Kategorien wiederholen
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <CategoryCard title="Kardiologie" count="12 Themen" colorClass="text-red-400" bgClass="bg-red-500/10" borderClass="border-red-900/30" />
            <CategoryCard title="Trauma" count="8 Themen" colorClass="text-orange-400" bgClass="bg-orange-500/10" borderClass="border-orange-900/30" />
            <CategoryCard title="Pädiatrie" count="15 Themen" colorClass="text-amber-400" bgClass="bg-amber-500/10" borderClass="border-amber-900/30" />
            <CategoryCard title="Neurologie" count="6 Themen" colorClass="text-blue-400" bgClass="bg-blue-500/10" borderClass="border-blue-900/30" />
          </div>
        </section>

      </div>
    </div>
  );
}

function LearnListItem({ title, category, to }: { title: string, category: string, to: string }) {
  return (
    <Link to={to} className="flex items-center justify-between p-4 bg-[#121212] rounded-2xl border border-[#2a2a2a] active:scale-[0.98] transition-transform">
      <div className="flex flex-col gap-1">
        <h4 className="font-medium text-neutral-200">{title}</h4>
        <span className="text-xs text-neutral-500">{category}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-neutral-600" />
    </Link>
  );
}

function CategoryCard({ title, count, colorClass, bgClass, borderClass }: { title: string, count: string, colorClass: string, bgClass: string, borderClass: string }) {
  return (
    <Link to="/search" className={cn("flex flex-col gap-2 p-4 rounded-xl border active:scale-[0.98] transition-all bg-[#121212]", borderClass)}>
      <h3 className={cn("font-semibold text-sm", colorClass)}>{title}</h3>
      <span className="text-xs text-neutral-500">{count}</span>
    </Link>
  );
}
