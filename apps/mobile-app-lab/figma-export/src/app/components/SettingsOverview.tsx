import { Link, useNavigate } from "react-router";
import { 
  ArrowLeft, User, Building2, Sliders, Brain, 
  CloudOff, Moon, LogOut, ChevronRight, Download, 
  Trash2, Activity, Settings2, Palette, Shield, Database, ExternalLink 
} from "lucide-react";
import { cn } from "../lib/utils";

export function SettingsOverview() {
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
            <h1 className="text-xl font-bold text-white">Einstellungen</h1>
            <span className="text-[11px] font-medium text-neutral-500">Profil & Konfiguration</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-8">
        
        {/* 1. Profil */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Profil</h2>
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl overflow-hidden flex flex-col">
            <SettingsItem to="/settings/profile" icon={<User className="w-5 h-5 text-indigo-400" />} label="Profil bearbeiten" value="Max Mustermann" />
            <SettingsDivider />
            <SettingsItem to="/settings/profile" icon={<Shield className="w-5 h-5 text-emerald-400" />} label="Rolle" value="Notfallsanitäter" />
            <SettingsDivider />
            <SettingsItem to="/settings/profile" icon={<Activity className="w-5 h-5 text-amber-400" />} label="Erfahrungslevel" value="Advanced" />
          </div>
        </section>

        {/* 2. Organisation */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Organisation</h2>
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl overflow-hidden flex flex-col">
            <SettingsItem to="/settings/organization" icon={<Building2 className="w-5 h-5 text-blue-400" />} label="Zugehörigkeit" value="Rettungsdienst Nord" />
            <SettingsDivider />
            <SettingsItem to="/settings/organization" icon={<ExternalLink className="w-5 h-5 text-neutral-400" />} label="Region / Wache" value="Wache 1 (Mitte)" />
            <SettingsDivider />
            <SettingsItem to="/settings/organization" icon={<Database className="w-5 h-5 text-cyan-400" />} label="Organisationsinhalte" value="Aktiv" />
          </div>
        </section>

        {/* 3. Personalisierung */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Personalisierung</h2>
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl overflow-hidden flex flex-col">
            <SettingsItem to="/settings/personalization" icon={<Settings2 className="w-5 h-5 text-purple-400" />} label="Startscreen Verhalten" />
            <SettingsDivider />
            <SettingsItem to="/settings/personalization" icon={<Sliders className="w-5 h-5 text-pink-400" />} label="Einsatzmodus priorisieren" value="An" />
            <SettingsDivider />
            <SettingsItem to="/settings/personalization" icon={<Palette className="w-5 h-5 text-amber-400" />} label="Dashboard anpassen" />
          </div>
        </section>

        {/* 4. Lernen & Nachbereitung */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Lernen & Nachbereitung</h2>
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl overflow-hidden flex flex-col">
            <SettingsItem to="/settings/learning" icon={<Brain className="w-5 h-5 text-indigo-400" />} label="Lernmodus" value="Aktiv" />
            <SettingsDivider />
            <SettingsItem to="/settings/learning" icon={<Activity className="w-5 h-5 text-emerald-400" />} label="Wiederholungsfrequenz" value="Standard" />
          </div>
        </section>

        {/* 5. Offline & Daten */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Offline & Daten</h2>
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl overflow-hidden flex flex-col">
            <SettingsItem to="#" icon={<CloudOff className="w-5 h-5 text-neutral-400" />} label="Offline Inhalte" value="240 MB" />
            <SettingsDivider />
            <SettingsItem to="#" icon={<Download className="w-5 h-5 text-blue-400" />} label="Sync beim Start" value="WLAN" />
            <SettingsDivider />
            <SettingsItem to="#" icon={<Trash2 className="w-5 h-5 text-red-400" />} label="Cache leeren" />
          </div>
        </section>

        {/* 6. Anzeige */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Anzeige</h2>
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl overflow-hidden flex flex-col">
            <SettingsItem to="#" icon={<Moon className="w-5 h-5 text-indigo-400" />} label="Darstellung" value="Dark Theme" />
            <SettingsDivider />
            <SettingsItem to="#" icon={<User className="w-5 h-5 text-neutral-400" />} label="Barrierefreiheit" />
          </div>
        </section>

        {/* 7. Account */}
        <section className="flex flex-col gap-3 mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Account</h2>
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl overflow-hidden flex flex-col">
            <SettingsItem to="#" icon={<LogOut className="w-5 h-5 text-red-400" />} label="Abmelden" />
            <SettingsDivider />
            <SettingsItem to="#" icon={<Trash2 className="w-5 h-5 text-red-600" />} label="Account löschen" />
          </div>
        </section>

      </div>
    </div>
  );
}

function SettingsItem({ to, icon, label, value }: { to: string, icon: React.ReactNode, label: string, value?: string }) {
  return (
    <Link to={to} className="flex items-center justify-between p-4 active:bg-[#1a1a1a] transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center border border-[#2a2a2a]">
          {icon}
        </div>
        <span className="font-semibold text-neutral-200 text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        {value && <span className="text-xs font-medium text-neutral-500">{value}</span>}
        <ChevronRight className="w-4 h-4 text-neutral-600" />
      </div>
    </Link>
  );
}

function SettingsDivider() {
  return <div className="h-[1px] w-full bg-[#2a2a2a] ml-14" />;
}