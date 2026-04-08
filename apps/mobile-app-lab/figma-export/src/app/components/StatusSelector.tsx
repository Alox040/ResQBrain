import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, Building2, Siren, Radio, Ban, ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

type StatusType = "status1" | "status2" | "status3" | "status5" | "status6";

interface StatusConfig {
  id: StatusType;
  label: string;
  subtitle: string;
  badgeLabel: string;
  color: string;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
  icon: React.ReactNode;
}

const STATUS_CONFIG: Record<StatusType, StatusConfig> = {
  status1: {
    id: "status1",
    label: "Status 1 – Einsatzbereit",
    subtitle: "Verfügbar für Einsätze",
    badgeLabel: "Einsatzbereit",
    color: "text-emerald-500",
    badgeBg: "bg-emerald-500/10",
    badgeBorder: "border-emerald-500/20",
    badgeColor: "bg-emerald-500",
    icon: <Zap className="w-4 h-4" />
  },
  status2: {
    id: "status2",
    label: "Status 2 – Einsatzbereit an der Wache",
    subtitle: "An der Wache verfügbar",
    badgeLabel: "Wache",
    color: "text-teal-500",
    badgeBg: "bg-teal-500/10",
    badgeBorder: "border-teal-500/20",
    badgeColor: "bg-teal-500",
    icon: <Building2 className="w-4 h-4" />
  },
  status3: {
    id: "status3",
    label: "Status 3 – Einsatz übernommen",
    subtitle: "Einsatz aktiv übernommen",
    badgeLabel: "Einsatz übernommen",
    color: "text-orange-500",
    badgeBg: "bg-orange-500/10",
    badgeBorder: "border-orange-500/20",
    badgeColor: "bg-orange-500",
    icon: <Siren className="w-4 h-4" />
  },
  status5: {
    id: "status5",
    label: "Status 5 – Sprechwunsch",
    subtitle: "Rückmeldung an Leitstelle",
    badgeLabel: "Sprechwunsch",
    color: "text-yellow-500",
    badgeBg: "bg-yellow-500/10",
    badgeBorder: "border-yellow-500/20",
    badgeColor: "bg-yellow-500",
    icon: <Radio className="w-4 h-4" />
  },
  status6: {
    id: "status6",
    label: "Status 6 – Nicht einsatzbereit",
    subtitle: "Nicht verfügbar",
    badgeLabel: "Nicht bereit",
    color: "text-neutral-400",
    badgeBg: "bg-neutral-800/50",
    badgeBorder: "border-neutral-700",
    badgeColor: "bg-neutral-500",
    icon: <Ban className="w-4 h-4" />
  }
};

export function StatusSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<StatusType>("status1");
  const popoverRef = useRef<HTMLDivElement>(null);

  const currentStatus = STATUS_CONFIG[status];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (newStatus: StatusType) => {
    setStatus(newStatus);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Badge Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 w-max px-2.5 py-1 rounded-full border transition-all active:scale-95 select-none relative z-10",
          currentStatus.badgeBg,
          currentStatus.badgeBorder
        )}
      >
        <div className={cn(
          "w-1.5 h-1.5 rounded-full", 
          currentStatus.badgeColor,
          status === "status1" ? "animate-pulse" : ""
        )} />
        <span className={cn(
          "text-[10px] font-bold uppercase tracking-wider",
          currentStatus.color
        )}>
          {currentStatus.badgeLabel}
        </span>
        <ChevronDown className={cn(
          "w-3 h-3 transition-transform duration-200", 
          currentStatus.color,
          isOpen ? "rotate-180" : ""
        )} />
      </button>

      {/* Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 w-[280px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 origin-top-left"
          >
            <div className="p-3 pb-2 border-b border-[#2a2a2a]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Status wählen</h3>
            </div>
            <div className="flex flex-col p-1.5 gap-1">
              {(Object.keys(STATUS_CONFIG) as StatusType[]).map((key) => {
                const option = STATUS_CONFIG[key];
                const isSelected = status === key;
                
                return (
                  <button
                    key={key}
                    onClick={() => handleSelect(key)}
                    className={cn(
                      "flex items-center gap-3 p-2.5 rounded-xl transition-colors text-left",
                      isSelected 
                        ? "bg-[#2a2a2a]" 
                        : "hover:bg-[#222222] active:bg-[#2a2a2a]"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border",
                      isSelected ? "bg-black/40 border-white/5" : "bg-[#121212] border-[#2a2a2a]"
                    )}>
                      <div className={cn(option.color)}>
                        {option.icon}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className={cn(
                        "text-sm font-medium leading-tight",
                        isSelected ? "text-white" : "text-neutral-300"
                      )}>
                        {option.label}
                      </span>
                      <span className="text-[11px] text-neutral-500 mt-0.5 leading-tight">
                        {option.subtitle}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}