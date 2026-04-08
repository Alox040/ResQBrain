import { useState } from "react";
import { Search, Mic } from "lucide-react";
import { cn } from "../lib/utils";

interface SearchFieldWithVoiceProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onVoiceStart?: () => void;
  onVoiceEnd?: () => void;
  wrapperClassName?: string;
}

export function SearchFieldWithVoice({ 
  className, 
  wrapperClassName,
  placeholder = "Suchen...", 
  onVoiceStart,
  onVoiceEnd,
  ...props 
}: SearchFieldWithVoiceProps) {
  const [isListening, setIsListening] = useState(false);

  const handleMicClick = (e: React.MouseEvent | React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Blur input if it was focused to prevent keyboard from opening
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    
    if (isListening) {
      setIsListening(false);
      onVoiceEnd?.();
    } else {
      setIsListening(true);
      onVoiceStart?.();
      
      // Auto-stop after 3 seconds for demo purposes
      setTimeout(() => {
        setIsListening(false);
        onVoiceEnd?.();
      }, 3000);
    }
  };

  return (
    <div className={cn("relative w-full", wrapperClassName)}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search className="w-5 h-5 text-neutral-500" />
      </div>
      
      <input 
        type="text" 
        placeholder={isListening ? "Höre zu..." : placeholder}
        className={cn(
          "w-full bg-[#121212] border border-[#2a2a2a] rounded-2xl py-4 pl-12 pr-12 text-[15px] font-medium text-white focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all placeholder:text-neutral-500",
          isListening && "border-red-500/50 bg-red-500/5 placeholder:text-red-400",
          className
        )}
        {...props}
      />
      
      <button 
        type="button"
        onPointerDown={handleMicClick}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-90",
          isListening 
            ? "text-red-400 bg-red-500/20" 
            : "text-neutral-400 hover:text-white hover:bg-[#1a1a1a]"
        )}
        title="Spracheingabe starten"
      >
        {isListening && (
          <span className="absolute inset-0 rounded-xl border border-red-500/50 animate-ping opacity-75" />
        )}
        <Mic className={cn("w-5 h-5 relative z-10", isListening && "animate-pulse")} />
      </button>
    </div>
  );
}