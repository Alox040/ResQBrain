import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Save, Calendar, Tag, MessageSquare, Plus, Check } from "lucide-react";

export function ReviewDetail() {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      navigate("/learn");
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-full bg-black text-neutral-100 p-4 pt-12 md:pt-4 gap-6 pb-24">
      
      {/* Header */}
      <header className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] text-neutral-400 active:scale-95 transition-transform">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-medium text-neutral-300">Neue Nachbereitung</span>
        <button onClick={handleSave} className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 active:scale-95 transition-transform">
          {isSaved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
        </button>
      </header>

      {/* Metadata Form */}
      <section className="flex flex-col gap-4">
        <div className="bg-[#121212] rounded-2xl border border-[#2a2a2a] overflow-hidden">
          
          <div className="flex items-center gap-3 p-4 border-b border-[#2a2a2a]">
            <MessageSquare className="w-5 h-5 text-neutral-500 shrink-0" />
            <input 
              type="text" 
              placeholder="Einsatz Titel (z.B. Reanimation B-Straße)" 
              className="bg-transparent border-none outline-none text-white w-full placeholder:text-neutral-600 font-medium"
              defaultValue="Reanimation B-Straße"
            />
          </div>
          
          <div className="flex items-center gap-3 p-4 border-b border-[#2a2a2a]">
            <Calendar className="w-5 h-5 text-neutral-500 shrink-0" />
            <input 
              type="text" 
              placeholder="Datum" 
              className="bg-transparent border-none outline-none text-white w-full placeholder:text-neutral-600 text-sm"
              defaultValue="Heute, 14:30"
            />
          </div>
          
          <div className="flex items-center gap-3 p-4">
            <Tag className="w-5 h-5 text-neutral-500 shrink-0" />
            <select className="bg-transparent border-none outline-none text-white w-full text-sm appearance-none">
              <option value="reanimation">Reanimation</option>
              <option value="trauma">Trauma</option>
              <option value="internistisch">Internistisch</option>
              <option value="pediatrisch">Pädiatrisch</option>
              <option value="other">Sonstiges</option>
            </select>
          </div>

        </div>
      </section>

      {/* Structured Checklist Reflection */}
      <section className="flex flex-col gap-4 mt-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 px-1">Checkliste: Reflexion</h2>
        
        <ReflectionField 
          title="Was lief gut?" 
          placeholder="z.B. Schnelle Teamfindung, effektive CPR..." 
          colorClass="text-emerald-400" 
          bgColorClass="bg-emerald-500/10"
        />
        
        <ReflectionField 
          title="Was war schwierig?" 
          placeholder="z.B. Atemwegsmanagement, Zugang legen..." 
          colorClass="text-amber-400" 
          bgColorClass="bg-amber-500/10"
        />
        
        <ReflectionField 
          title="Was lernen wir daraus?" 
          placeholder="z.B. Nächstes Mal i.o. Zugang früher erwägen..." 
          colorClass="text-indigo-400" 
          bgColorClass="bg-indigo-500/10"
        />
      </section>

      {/* Free Text */}
      <section className="flex flex-col gap-4 mt-2 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 px-1">Zusätzliche Notizen</h2>
        <textarea 
          className="w-full bg-[#121212] rounded-2xl border border-[#2a2a2a] p-4 text-sm text-neutral-200 outline-none placeholder:text-neutral-600 min-h-[120px] resize-none focus:border-indigo-500/50 transition-colors"
          placeholder="Weitere Gedanken, offene Fragen, Feedback ans Team..."
        ></textarea>
      </section>

    </div>
  );
}

function ReflectionField({ title, placeholder, colorClass, bgColorClass }: { title: string, placeholder: string, colorClass: string, bgColorClass: string }) {
  return (
    <div className="bg-[#121212] rounded-2xl border border-[#2a2a2a] p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${bgColorClass} ${colorClass.replace('text-', 'bg-').replace('400', '500')}`} />
        <h3 className={`text-sm font-semibold ${colorClass}`}>{title}</h3>
      </div>
      <textarea 
        className="w-full bg-transparent border-none text-sm text-neutral-200 outline-none placeholder:text-neutral-600 min-h-[60px] resize-none"
        placeholder={placeholder}
      ></textarea>
    </div>
  );
}
