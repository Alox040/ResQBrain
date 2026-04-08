import { useState } from "react";
import { useNavigate } from "react-router";
import { X, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { cn } from "../lib/utils";

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

const mockQuestion = {
  id: "q1",
  text: "Welche Dosis Adrenalin wird bei der Reanimation (Erwachsene) alle 3-5 Minuten empfohlen?",
  answers: [
    { id: "a1", text: "0,1 mg i.v.", isCorrect: false },
    { id: "a2", text: "1,0 mg i.v.", isCorrect: true },
    { id: "a3", text: "3,0 mg i.v.", isCorrect: false },
    { id: "a4", text: "0,5 mg i.m.", isCorrect: false },
  ]
};

export function QuizSession() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleSelect = (id: string) => {
    if (isRevealed) return;
    setSelectedId(id);
  };

  const handleConfirm = () => {
    if (!selectedId) return;
    if (!isRevealed) {
      setIsRevealed(true);
    } else {
      // Navigate to next question or result
      navigate('/tests/result/1');
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-black text-neutral-100 selection:bg-indigo-900/50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#2a2a2a]">
        <div className="flex items-center justify-between p-4 pt-12 md:pt-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/tests')} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] text-neutral-400 active:scale-95 transition-transform border border-[#2a2a2a]">
              <X className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-white">Advanced Life Support</h1>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-neutral-400 bg-[#1a1a1a] border border-[#2a2a2a]">
            3 / 10
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-[#1a1a1a]">
          <div className="h-full bg-indigo-500 w-[30%] transition-all duration-500" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-8 justify-between pb-32">
        <div className="flex flex-col gap-6">
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-[2rem] p-6 flex flex-col gap-4 shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Frage 3</span>
            <h2 className="text-xl font-semibold text-white leading-relaxed">
              {mockQuestion.text}
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {mockQuestion.answers.map((ans) => {
              const isSelected = selectedId === ans.id;
              const showCorrect = isRevealed && ans.isCorrect;
              const showWrong = isRevealed && isSelected && !ans.isCorrect;

              return (
                <button
                  key={ans.id}
                  onClick={() => handleSelect(ans.id)}
                  disabled={isRevealed}
                  className={cn(
                    "p-4 rounded-2xl border-2 text-left font-medium transition-all flex items-center justify-between",
                    !isRevealed && isSelected ? "bg-indigo-500/10 border-indigo-500 text-white" : "",
                    !isRevealed && !isSelected ? "bg-[#1a1a1a] border-[#2a2a2a] hover:bg-[#222] text-neutral-300" : "",
                    showCorrect ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]" : "",
                    showWrong ? "bg-red-500/10 border-red-500 text-red-400" : "",
                    isRevealed && !ans.isCorrect && !isSelected ? "bg-[#1a1a1a] border-[#2a2a2a] opacity-50 text-neutral-500" : ""
                  )}
                >
                  <span className="text-[15px]">{ans.text}</span>
                  {showCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  {showWrong && <XCircle className="w-5 h-5 text-red-500" />}
                  {!isRevealed && isSelected && <div className="w-4 h-4 rounded-full border-4 border-indigo-500" />}
                  {!isRevealed && !isSelected && <div className="w-4 h-4 rounded-full border-2 border-neutral-600" />}
                </button>
              );
            })}
          </div>

          {/* Explanation box shown after reveal */}
          {isRevealed && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 flex gap-4 mt-2 animate-in fade-in slide-in-from-bottom-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30">
                <Lightbulb className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-[13px] text-blue-100 leading-relaxed pt-1">
                Gemäß den aktuellen ERC-Richtlinien wird bei der kardiopulmonalen Reanimation von Erwachsenen die Gabe von 1 mg Adrenalin i.v./i.o. alle 3-5 Minuten empfohlen.
              </p>
            </div>
          )}
        </div>

        {/* Sticky Bottom Action */}
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent pt-12 md:pb-6 z-40 -mx-4 -mb-4 px-8 pb-8">
          <button
            onClick={handleConfirm}
            disabled={!selectedId}
            className={cn(
              "w-full py-4 rounded-2xl font-bold text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2",
              !selectedId ? "bg-[#2a2a2a] text-neutral-500 cursor-not-allowed" : 
              !isRevealed ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/30" :
              "bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a]"
            )}
          >
            {!isRevealed ? "Antwort prüfen" : "Nächste Frage"}
          </button>
        </div>
      </div>
    </div>
  );
}