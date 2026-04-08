import { useNavigate } from "react-router";
import { ArrowLeft, Bell, ChevronRight, Zap, Store, PlayCircle } from "lucide-react";
import { cn } from "../lib/utils";

export function News() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-black text-neutral-100 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between p-4 pt-12 md:pt-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] text-neutral-400 active:scale-95 transition-transform border border-[#2a2a2a]">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white">Neuigkeiten</h1>
              <span className="text-[11px] font-medium text-neutral-500">Updates & Informationen</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-8 mt-2">
        
        {/* App Updates */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">App Updates</h2>
          <div className="flex flex-col gap-2">
            <NewsListItem 
              title="Neue KI-Zusammenfassungen" 
              category="Feature" 
              date="Heute" 
              isNew 
              icon={<Zap className="w-4 h-4 text-indigo-400" />}
              iconBg="bg-indigo-500/10 border-indigo-500/20"
            />
            <NewsListItem 
              title="Dark Mode Performance Boost" 
              category="Update" 
              date="Vor 3 Tagen" 
              icon={<Bell className="w-4 h-4 text-emerald-400" />}
              iconBg="bg-emerald-500/10 border-emerald-500/20"
            />
          </div>
        </section>

        {/* Neue Inhalte */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Neue Inhalte</h2>
          <div className="flex flex-col gap-2">
            <NewsListItem 
              title="SOP: Traumatische Reanimation (Update 2026)" 
              category="Algorithmus" 
              date="Gestern" 
              isNew 
              icon={<Zap className="w-4 h-4 text-red-400" />}
              iconBg="bg-red-500/10 border-red-500/20"
            />
            <NewsListItem 
              title="Dosierungsanpassung: Ketamin bei Kindern" 
              category="Medikation" 
              date="Letzte Woche" 
              icon={<Zap className="w-4 h-4 text-blue-400" />}
              iconBg="bg-blue-500/10 border-blue-500/20"
            />
          </div>
        </section>

        {/* Partner Inhalte */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Partner Inhalte</h2>
          <div className="flex flex-col gap-2">
            <NewsListItem 
              title="Atemwegsmanagement Kurs online" 
              category="Marktplatz" 
              date="Vor 5 Tagen" 
              icon={<Store className="w-4 h-4 text-cyan-400" />}
              iconBg="bg-cyan-500/10 border-cyan-500/20"
            />
            <NewsListItem 
              title="Neuer Partner: Notfallmedizin e.V." 
              category="Organisation" 
              date="01. April" 
              icon={<Store className="w-4 h-4 text-neutral-400" />}
              iconBg="bg-neutral-800 border-neutral-700"
            />
          </div>
        </section>

        {/* Lern Empfehlungen */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Lern Empfehlungen</h2>
          <div className="flex flex-col gap-2">
            <NewsListItem 
              title="Test: Pädiatrische Dosierungen" 
              category="Lernen" 
              date="Empfohlen" 
              icon={<PlayCircle className="w-4 h-4 text-amber-400" />}
              iconBg="bg-amber-500/10 border-amber-500/20"
            />
          </div>
        </section>

      </div>
    </div>
  );
}

function NewsListItem({ title, category, date, isNew, icon, iconBg }: { title: string, category: string, date: string, isNew?: boolean, icon: React.ReactNode, iconBg: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#121212] border border-[#2a2a2a] rounded-2xl active:bg-[#1a1a1a] transition-colors cursor-pointer relative overflow-hidden">
      <div className="flex flex-col gap-1 z-10 w-full pr-8">
        <div className="flex items-center gap-2 mb-0.5">
          <div className={cn("w-6 h-6 rounded-md flex items-center justify-center border shrink-0", iconBg)}>
            {icon}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">{category}</span>
          <span className="text-[10px] font-medium text-neutral-600">·</span>
          <span className="text-[10px] font-medium text-neutral-500">{date}</span>
          
          {isNew && (
            <span className="ml-auto text-[9px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded-md flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
              Neu
            </span>
          )}
        </div>
        
        <span className="font-semibold text-neutral-200 text-[14px] leading-snug">{title}</span>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
        <ChevronRight className="w-5 h-5 text-neutral-600" />
      </div>
    </div>
  );
}