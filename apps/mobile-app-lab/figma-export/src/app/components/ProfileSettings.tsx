import { useNavigate } from "react-router";
import { ArrowLeft, User, Mail, Shield, CheckCircle2, Save } from "lucide-react";
import { cn } from "../lib/utils";
import { useState } from "react";

export function ProfileSettings() {
  const navigate = useNavigate();
  const [role, setRole] = useState("Notfallsanitäter");

  const roles = [
    "Notfallsanitäter",
    "Rettungssanitäter",
    "Rettungshelfer",
    "Notarzt",
    "Azubi / Schüler",
  ];

  return (
    <div className="flex flex-col min-h-full bg-black text-neutral-100 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#2a2a2a]">
        <div className="flex items-center gap-3 p-4 pt-12 md:pt-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] text-neutral-400 active:scale-95 transition-transform border border-[#2a2a2a]">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white">Profil</h1>
            <span className="text-[11px] font-medium text-neutral-500">Persönliche Daten & Rolle</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-8">
        
        {/* Avatar Placeholder */}
        <div className="flex flex-col items-center justify-center mt-4">
          <div className="w-24 h-24 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center relative mb-4">
            <User className="w-10 h-10 text-indigo-400" />
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-white text-xs font-bold shadow-lg">
              <span className="text-[10px]">Ändern</span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Allgemein</h2>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 ml-1">Vor- und Nachname</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <User className="w-5 h-5 text-neutral-500" />
              </div>
              <input 
                type="text" 
                defaultValue="Max Mustermann"
                className="w-full bg-[#121212] border border-[#2a2a2a] rounded-2xl py-4 pl-12 pr-4 text-[15px] font-medium text-white focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 ml-1">E-Mail Adresse</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Mail className="w-5 h-5 text-neutral-500" />
              </div>
              <input 
                type="email" 
                defaultValue="max@rescue-domain.de"
                readOnly
                className="w-full bg-[#121212] border border-[#2a2a2a] rounded-2xl py-4 pl-12 pr-4 text-[15px] font-medium text-neutral-400 focus:outline-none opacity-70"
              />
            </div>
          </div>
        </section>

        {/* Role Selection */}
        <section className="flex flex-col gap-4 mt-2 mb-6">
          <div className="flex items-center gap-2 pl-1 mb-1">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Qualifikation / Rolle</h2>
          </div>
          
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-[2rem] p-2 flex flex-col gap-1">
            {roles.map((r) => (
              <button 
                key={r}
                onClick={() => setRole(r)}
                className={cn(
                  "flex items-center justify-between w-full p-4 rounded-2xl transition-all",
                  role === r ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-transparent border border-transparent hover:bg-[#1a1a1a]"
                )}
              >
                <span className={cn("text-[15px] font-semibold", role === r ? "text-emerald-400" : "text-neutral-300")}>{r}</span>
                {role === r && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              </button>
            ))}
          </div>
        </section>

      </div>

      {/* Floating Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent pt-12 md:pb-6 z-40">
        <button
          onClick={() => navigate(-1)}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl text-[15px] font-bold transition-all shadow-xl shadow-indigo-900/30 flex items-center justify-center gap-2 active:scale-95"
        >
          <Save className="w-5 h-5" /> Änderungen speichern
        </button>
      </div>

    </div>
  );
}