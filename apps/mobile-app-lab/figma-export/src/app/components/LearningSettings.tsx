import { useNavigate } from "react-router";
import { ArrowLeft, Brain, Bell, LineChart, FileText, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";
import { useState } from "react";

export function LearningSettings() {
  const navigate = useNavigate();
  
  const [learningMode, setLearningMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoTests, setAutoTests] = useState(true);
  const [progressVisible, setProgressVisible] = useState(true);

  return (
    <div className="flex flex-col min-h-full bg-black text-neutral-100 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#2a2a2a]">
        <div className="flex items-center gap-3 p-4 pt-12 md:pt-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] text-neutral-400 active:scale-95 transition-transform border border-[#2a2a2a]">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white">Lernen & Nachbereitung</h1>
            <span className="text-[11px] font-medium text-neutral-500">Studium optimieren</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-8 mt-2">
        
        {/* Core settings */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Aktivitäten</h2>
          
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl overflow-hidden flex flex-col">
            
            <div className="flex items-center justify-between p-4 hover:bg-[#1a1a1a] transition-colors cursor-pointer" onClick={() => setLearningMode(!learningMode)}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20">
                  <Brain className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-neutral-200 text-[15px]">Lernmodus aktivieren</span>
                  <p className="text-xs text-neutral-500 leading-snug">Aktiviere interaktives Lernen und Nachbereiten.</p>
                </div>
              </div>
              <div className={cn(
                "w-12 h-6 rounded-full flex items-center shrink-0 transition-colors p-1",
                learningMode ? "bg-purple-500" : "bg-[#2a2a2a]"
              )}>
                <div className={cn(
                  "w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                  learningMode ? "translate-x-6" : "translate-x-0"
                )} />
              </div>
            </div>

            <div className="h-[1px] w-full bg-[#2a2a2a] ml-16" />

            <div className="flex items-center justify-between p-4 hover:bg-[#1a1a1a] transition-colors cursor-pointer" onClick={() => setAutoTests(!autoTests)}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20">
                  <FileText className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-neutral-200 text-[15px]">Tests vorschlagen</span>
                  <p className="text-xs text-neutral-500 leading-snug">Generiert Lerntests aus deinen Nachbereitungen.</p>
                </div>
              </div>
              <div className={cn(
                "w-12 h-6 rounded-full flex items-center shrink-0 transition-colors p-1",
                autoTests ? "bg-indigo-500" : "bg-[#2a2a2a]"
              )}>
                <div className={cn(
                  "w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                  autoTests ? "translate-x-6" : "translate-x-0"
                )} />
              </div>
            </div>

          </div>
        </section>

        {/* Notifications & Progress */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Benachrichtigungen & Statistik</h2>
          
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl overflow-hidden flex flex-col">
            
            <div className="flex items-center justify-between p-4 hover:bg-[#1a1a1a] transition-colors cursor-pointer" onClick={() => setNotifications(!notifications)}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center shrink-0 border border-[#2a2a2a]">
                  <Bell className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-neutral-200 text-[15px]">Erinnerungen & Alerts</span>
                  <p className="text-xs text-neutral-500 leading-snug">Erinnert an offene Nachbereitungen und Tests.</p>
                </div>
              </div>
              <div className={cn(
                "w-12 h-6 rounded-full flex items-center shrink-0 transition-colors p-1",
                notifications ? "bg-emerald-500" : "bg-[#2a2a2a]"
              )}>
                <div className={cn(
                  "w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                  notifications ? "translate-x-6" : "translate-x-0"
                )} />
              </div>
            </div>

            <div className="h-[1px] w-full bg-[#2a2a2a] ml-16" />

            <div className="flex items-center justify-between p-4 hover:bg-[#1a1a1a] transition-colors cursor-pointer" onClick={() => setProgressVisible(!progressVisible)}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center shrink-0 border border-[#2a2a2a]">
                  <LineChart className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-neutral-200 text-[15px]">Lernfortschritt zeigen</span>
                  <p className="text-xs text-neutral-500 leading-snug">Level und Fortschritt im Dashboard einblenden.</p>
                </div>
              </div>
              <div className={cn(
                "w-12 h-6 rounded-full flex items-center shrink-0 transition-colors p-1",
                progressVisible ? "bg-emerald-500" : "bg-[#2a2a2a]"
              )}>
                <div className={cn(
                  "w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                  progressVisible ? "translate-x-6" : "translate-x-0"
                )} />
              </div>
            </div>

          </div>
        </section>
        
        {/* Settings options without toggles */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-1">Frequenz</h2>
          
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-2xl p-2 flex flex-col gap-1">
            <button className="flex items-center justify-between p-3 px-4 rounded-xl hover:bg-[#1a1a1a] transition-colors bg-[#1a1a1a] border border-[#2a2a2a]">
              <span className="font-semibold text-emerald-400 text-[15px]">Standard (Empfohlen)</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </button>
            <button className="flex items-center justify-between p-3 px-4 rounded-xl hover:bg-[#1a1a1a] transition-colors bg-transparent border border-transparent">
              <span className="font-semibold text-neutral-300 text-[15px]">Intensiv</span>
            </button>
            <button className="flex items-center justify-between p-3 px-4 rounded-xl hover:bg-[#1a1a1a] transition-colors bg-transparent border border-transparent">
              <span className="font-semibold text-neutral-300 text-[15px]">Gelegentlich</span>
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}