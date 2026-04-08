import { useState } from "react";
import { Link } from "react-router";
import { Search as SearchIcon, X, Filter, Activity, Pill, ChevronRight, FileText } from "lucide-react";
import { cn } from "../lib/utils";

type FilterType = "All" | "Algorithms" | "Medications" | "Protocols";

const MOCK_DATA = [
  { id: "anaphylaxis", title: "Anaphylaxis", type: "Algorithm", tags: ["Adult", "Pediatric"] },
  { id: "epinephrine", title: "Epinephrine (Adrenalin)", type: "Medication", tags: ["1mg/ml", "0.1mg/ml"] },
  { id: "acs", title: "Acute Coronary Syndrome", type: "Protocol", tags: ["STEMI", "NSTEMI"] },
  { id: "cpr", title: "Adult ALS", type: "Algorithm", tags: ["ERC 2021"] },
  { id: "amiodarone", title: "Amiodarone", type: "Medication", tags: ["150mg/3ml"] },
  { id: "asthma", title: "Asthma Exacerbation", type: "Protocol", tags: ["Adult"] },
];

import { SearchFieldWithVoice } from "./SearchFieldWithVoice";

export function Search() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const filteredData = MOCK_DATA.filter((item) => {
    const matchesFilter = activeFilter === "All" || item.type + "s" === activeFilter;
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase()) || 
                         item.tags.some(t => t.toLowerCase().includes(query.toLowerCase()));
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="flex flex-col min-h-full bg-[#0a0a0a] text-neutral-100 p-4 pt-12 md:pt-4 gap-4">
      
      {/* Search Input Sticky Header */}
      <div className="sticky top-0 z-10 bg-[#0a0a0a]/90 backdrop-blur pb-2 pt-2 flex flex-col gap-3">
        <SearchFieldWithVoice
          autoFocus
          placeholder="Search algorithms, meds..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 bg-[#1a1a1a]"
        />

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <FilterChip 
            label="All" 
            isActive={activeFilter === "All"} 
            onClick={() => setActiveFilter("All")} 
          />
          <FilterChip 
            label="Algorithms" 
            icon={<Activity className="w-3 h-3" />}
            isActive={activeFilter === "Algorithms"} 
            onClick={() => setActiveFilter("Algorithms")} 
          />
          <FilterChip 
            label="Medications" 
            icon={<Pill className="w-3 h-3" />}
            isActive={activeFilter === "Medications"} 
            onClick={() => setActiveFilter("Medications")} 
          />
          <FilterChip 
            label="Protocols" 
            icon={<FileText className="w-3 h-3" />}
            isActive={activeFilter === "Protocols"} 
            onClick={() => setActiveFilter("Protocols")} 
          />
        </div>
      </div>

      {/* Results List */}
      <div className="flex flex-col gap-2 mt-2 pb-24">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <ResultRow key={item.id} item={item} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-500 gap-4">
            <SearchIcon className="w-12 h-12 opacity-20" />
            <p className="text-sm font-medium">No results found for "{query}"</p>
          </div>
        )}
      </div>
      
    </div>
  );
}

function FilterChip({ label, icon, isActive, onClick }: { label: string, icon?: React.ReactNode, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-4 h-8 rounded-full text-xs font-semibold whitespace-nowrap transition-all border",
        isActive 
          ? "bg-red-950/40 border-red-500/50 text-red-200" 
          : "bg-[#1a1a1a] border-[#2a2a2a] text-neutral-400 hover:bg-[#222]"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function ResultRow({ item }: { item: any }) {
  const isMed = item.type === "Medication";
  const isAlgo = item.type === "Algorithm";
  
  const icon = isMed ? <Pill className="w-5 h-5" /> : isAlgo ? <Activity className="w-5 h-5" /> : <FileText className="w-5 h-5" />;
  const iconColorClass = isMed ? "text-blue-400 bg-blue-950/30" : isAlgo ? "text-red-400 bg-red-950/30" : "text-emerald-400 bg-emerald-950/30";
  const link = isMed ? `/medication/${item.id}` : `/algorithm/${item.id}`;

  return (
    <Link to={link} className="flex items-center justify-between p-4 bg-[#121212] rounded-2xl border border-[#222] active:bg-[#1a1a1a] transition-colors">
      <div className="flex items-center gap-4">
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", iconColorClass)}>
          {icon}
        </div>
        <div className="flex flex-col gap-0.5">
          <h4 className="font-medium text-neutral-100 text-sm md:text-base leading-tight">{item.title}</h4>
          <div className="flex gap-2 items-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">{item.type}</span>
            {item.tags.map((tag: string) => (
              <span key={tag} className="text-[10px] bg-[#1a1a1a] text-neutral-400 px-1.5 py-0.5 rounded-md border border-[#2a2a2a]">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-neutral-600 shrink-0 ml-2" />
    </Link>
  );
}
