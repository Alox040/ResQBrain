import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, CheckCircle2, Star, ShieldCheck, ExternalLink, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";

export function PartnerDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="flex flex-col min-h-full bg-black text-neutral-100 pb-24">
      {/* Header Banner */}
      <div className="h-32 bg-gradient-to-br from-cyan-900/40 to-blue-900/40 relative">
        <button onClick={() => navigate(-1)} className="absolute top-12 left-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md text-white active:scale-95 transition-transform z-10 border border-white/10">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 flex flex-col gap-6 -mt-12 relative z-10">
        {/* Profile Info */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div className="w-24 h-24 rounded-3xl bg-[#16161a] border-4 border-black flex items-center justify-center shadow-xl">
              <ShieldCheck className="w-12 h-12 text-cyan-400" />
            </div>
            <div className="flex gap-2 mb-2">
              <button className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center active:scale-95 transition-transform text-neutral-400 hover:text-white">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">MeduLearn Academy</h1>
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-sm text-neutral-400 mt-1.5 leading-relaxed">
              Zertifizierter Trainingsanbieter & Content Creator für den Rettungsdienst.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#121212] border border-[#2a2a2a] rounded-2xl p-4">
            <div className="flex flex-col gap-1 flex-1 items-center border-r border-[#2a2a2a]">
              <div className="flex items-center gap-1.5 text-sm text-white">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-bold">4.9</span>
              </div>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">128 Reviews</span>
            </div>
            <div className="flex flex-col gap-1 flex-1 items-center">
              <span className="text-sm font-bold text-white">12</span>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Inhalte</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white py-3.5 rounded-2xl text-sm font-semibold transition-colors active:scale-95 text-center flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20">
            Alle Inhalte freischalten (Pro)
          </button>
        </div>

        {/* Description */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Über den Partner</h2>
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl p-5">
            <p className="text-sm text-neutral-300 leading-relaxed">
              MeduLearn bietet interaktive Fallbeispiele und detaillierte Kurse für Rettungsfachpersonal. Unsere Inhalte sind evidenzbasiert und nach aktuellen Guidelines (ERC/AHA) zertifiziert.
            </p>
          </div>
        </section>

        {/* Lernmaterial Liste */}
        <section className="flex flex-col gap-3 mt-2 mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Verfügbare Inhalte</h2>
          <div className="flex flex-col gap-3">
            <PartnerContentItem id="1" title="ACLS MegaCode Simulator" type="Interaktives Training" price="Kostenlos" />
            <PartnerContentItem id="4" title="Pädiatrische Notfälle" type="Kurspaket" price="9,99 €" />
            <PartnerContentItem id="5" title="Airway Management" type="Algorithmen-Erweiterung" price="4,99 €" />
          </div>
        </section>
      </div>
    </div>
  );
}

function PartnerContentItem({ id, title, type, price }: { id: string, title: string, type: string, price: string }) {
  const isFree = price.toLowerCase() === "kostenlos";
  return (
    <Link to={`/marketplace/content/${id}`} className="flex items-center justify-between p-4 bg-[#121212] rounded-2xl border border-[#2a2a2a] active:scale-[0.98] transition-transform">
      <div className="flex flex-col gap-1.5">
        <h4 className="font-bold text-neutral-200 text-[15px]">{title}</h4>
        <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold bg-[#1a1a1a] border border-[#2a2a2a] px-2 py-0.5 rounded-md w-max">{type}</span>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <span className={cn("text-xs font-bold px-2.5 py-1 rounded-md border", isFree ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-white bg-[#1a1a1a] border-[#2a2a2a]")}>{price}</span>
        <ChevronRight className="w-4 h-4 text-neutral-600 mt-1" />
      </div>
    </Link>
  );
}
