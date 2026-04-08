import { Link, useNavigate } from "react-router";
import { ArrowLeft, Store, ChevronRight, Star, ShieldCheck } from "lucide-react";
import { cn } from "../lib/utils";

export function MarketplaceOverview() {
  const navigate = useNavigate();
  const categories = ["Alle", "Algorithmen", "Medikamente", "Training", "Fallbeispiele", "Kurse", "Lernpakete"];

  return (
    <div className="flex flex-col min-h-full bg-black text-neutral-100 p-4 pt-12 md:pt-4 gap-8 pb-24">
      {/* Header */}
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] text-neutral-400 active:scale-95 transition-transform shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Marktplatz</h1>
          <p className="text-sm text-cyan-400 font-medium mt-0.5">Offizielle Partner-Inhalte</p>
        </div>
      </header>

      {/* 1. Featured Partner */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Featured Partner</h2>
        <FeaturedPartnerCard />
      </section>

      {/* 2. Kategorien */}
      <section className="flex flex-col gap-3 -mx-4 px-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 snap-x">
          {categories.map((cat, i) => (
            <button key={i} className={cn("px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap snap-center active:scale-95 transition-transform", i === 0 ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "bg-[#1a1a1a] text-neutral-300 border border-[#2a2a2a]")}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 4. Beliebt (Horizontal scroll cards) */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Beliebte Kurse & Pakete</h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 snap-x">
          <PopularCard title="Advanced ALS Paket" provider="MeduLearn" info="Umfassendes Training" to="/marketplace/content/1" />
          <PopularCard title="Pädiatrie Basics" provider="KinderNotfall" info="Sicheres Handeln" to="/marketplace/content/2" />
          <PopularCard title="Trauma Update '24" provider="RescueAcademy" info="Neueste Guidelines" to="/marketplace/content/3" />
        </div>
      </section>

      {/* 3. Partner Inhalte (List) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Neueste Inhalte</h2>
        </div>
        <MarketplaceList>
          <ContentCard id="1" title="ACLS MegaCode Simulator" provider="MeduLearn" desc="Interaktives Fallbeispiel-Training für ALS Algorithmen." tags={["Training", "Paket"]} price="Kostenlos" />
          <ContentCard id="2" title="Trauma-Management Guidelines" provider="RescueAcademy" desc="Kompakte Übersicht aller relevanten Trauma-Algorithmen." tags={["Kurse", "Algorithmen"]} price="4,99 €" />
          <ContentCard id="3" title="EKG Basics & Advanced" provider="CardioTeach" desc="Lerne EKGs strukturiert zu interpretieren und zu handeln." tags={["Kurse"]} price="Kostenlos" />
        </MarketplaceList>
      </section>

      {/* 5. Für dich empfohlen (placeholder) */}
      <section className="flex flex-col gap-4 mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Für dich empfohlen</h2>
        <div className="bg-[#121212] rounded-2xl border border-[#2a2a2a] p-5 flex flex-col items-center text-center gap-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 relative z-10">
            <Star className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-semibold text-neutral-200">Empfohlen basierend auf Lernen</h3>
            <p className="text-xs text-neutral-500 mt-1.5 max-w-[250px]">Wir analysieren deinen Lernfortschritt, um dir passende Inhalte vorzuschlagen.</p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-cyan-400 bg-cyan-500/10 mt-1 relative z-10 border border-cyan-500/20">
            Kommt bald
          </span>
        </div>
      </section>
    </div>
  );
}

// Components

function FeaturedPartnerCard() {
  return (
    <Link to="/marketplace/partner/1" className="w-full bg-[#16161a] rounded-[2rem] border border-[#2a2a2a] overflow-hidden flex flex-col active:scale-[0.98] transition-transform">
      <div className="h-28 bg-gradient-to-br from-cyan-900/40 to-blue-900/20 relative flex items-end p-5">
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">Top Partner</span>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border-4 border-[#16161a] flex items-center justify-center shadow-xl absolute -bottom-6">
          <ShieldCheck className="w-8 h-8 text-cyan-400" />
        </div>
      </div>
      <div className="p-5 pt-8 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg text-white">MeduLearn Academy</h3>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">Offizieller Partner für zertifizierte ALS & BLS Trainings mit interaktiven Fallbeispielen.</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-cyan-400">12 Inhalte verfügbar</span>
          <div className="flex items-center gap-1 text-xs font-bold text-white bg-[#2a2a2a] px-3 py-1.5 rounded-lg">
            Ansehen <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function PopularCard({ title, provider, info, to }: { title: string, provider: string, info: string, to: string }) {
  return (
    <Link to={to} className="min-w-[200px] flex flex-col gap-3 p-4 bg-[#121212] rounded-2xl border border-[#2a2a2a] active:scale-[0.98] transition-transform snap-center">
      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
        <Store className="w-5 h-5 text-cyan-400" />
      </div>
      <div>
        <h4 className="font-semibold text-neutral-200 text-sm">{title}</h4>
        <span className="text-[10px] text-neutral-500 font-medium">{provider}</span>
      </div>
      <p className="text-xs text-neutral-400 mt-1">{info}</p>
    </Link>
  );
}

function ContentCard({ id, title, provider, desc, tags, price }: { id: string, title: string, provider: string, desc: string, tags: string[], price: string }) {
  const isFree = price.toLowerCase() === "kostenlos";
  return (
    <div className="flex flex-col p-4 bg-[#121212] rounded-2xl border border-[#2a2a2a]">
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span key={i} className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-neutral-400 bg-[#1a1a1a] border border-[#2a2a2a]">
                {tag}
              </span>
            ))}
          </div>
          <h4 className="font-bold text-neutral-100 text-base leading-tight mt-1">{title}</h4>
          <span className="text-xs text-neutral-500 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> {provider}
          </span>
          <p className="text-xs text-neutral-400 mt-1 leading-relaxed line-clamp-2">{desc}</p>
        </div>
        <div className="flex flex-col items-end gap-3 justify-between shrink-0">
          <span className={cn("text-sm font-bold", isFree ? "text-emerald-400" : "text-white")}>{price}</span>
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-4 border-t border-[#2a2a2a]">
        <Link to={`/marketplace/content/${id}`} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-2 rounded-xl active:scale-95 transition-all hover:bg-[#2a2a2a]">
          Details <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

function MarketplaceList({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-3">{children}</div>;
}
