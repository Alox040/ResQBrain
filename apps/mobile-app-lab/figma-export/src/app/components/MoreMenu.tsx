import { Link } from "react-router";
import { Store, Brain, Star, Settings, Info, ChevronRight, Activity } from "lucide-react";

export function MoreMenu() {
  return (
    <div className="flex flex-col min-h-full bg-black text-neutral-100 p-4 pt-12 md:pt-4 gap-6 pb-24">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-white">Mehr</h1>
      </header>
      <div className="flex flex-col gap-3">
        <MenuLink 
          to="/learn" 
          icon={<Brain className="w-5 h-5 text-purple-400" />} 
          title="Lernen & Nachbereitung" 
          subtitle="Lernmodus, Reviews & Fortschritt" 
        />
        <MenuLink 
          to="/marketplace" 
          icon={<Store className="w-5 h-5 text-cyan-400" />} 
          title="Marktplatz" 
          subtitle="Inhalte von Partnern entdecken" 
        />
        <MenuLink 
          to="#" 
          icon={<Star className="w-5 h-5 text-yellow-400" />} 
          title="Favoriten" 
          subtitle="Gespeicherte Algorithmen & Meds" 
        />
        <MenuLink 
          to="/ekg-spicker" 
          icon={<Activity className="w-5 h-5 text-emerald-400" />} 
          title="EKG-Spicker" 
          subtitle="Rhythmen & Schnellübersicht" 
        />
        <MenuLink 
          to="/settings" 
          icon={<Settings className="w-5 h-5 text-neutral-400" />} 
          title="Einstellungen" 
          subtitle="App-Konfiguration & Offline-Modus" 
        />
        <MenuLink 
          to="#" 
          icon={<Info className="w-5 h-5 text-indigo-400" />} 
          title="Über die App" 
          subtitle="Version, Impressum & Datenschutz" 
        />
      </div>
    </div>
  );
}

function MenuLink({ to, icon, title, subtitle }: { to: string, icon: React.ReactNode, title: string, subtitle: string }) {
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
