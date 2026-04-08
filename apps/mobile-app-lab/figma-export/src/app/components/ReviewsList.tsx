import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Search, Plus, Filter, FileText, CheckCircle2, Clock, AlertTriangle, ChevronRight, Brain } from "lucide-react";
import { cn } from "../lib/utils";

type ReviewStatus = "offen" | "abgeschlossen";
type ReviewTag = "lernen" | "wichtig" | null;

interface ReviewItem {
  id: string;
  title: string;
  time: string;
  status: ReviewStatus;
  tag: ReviewTag;
}

interface DayGroup {
  label: string;
  items: ReviewItem[];
}

const mockData: DayGroup[] = [
  {
    label: "Heute",
    items: [
      { id: "1", title: "Reanimation B-Straße", time: "14:30", status: "offen", tag: "wichtig" },
      { id: "2", title: "Anaphylaxie Restaurant", time: "10:15", status: "abgeschlossen", tag: "lernen" },
      { id: "3", title: "Hypertensiver Notfall", time: "08:45", status: "abgeschlossen", tag: null },
    ],
  },
  {
    label: "Gestern",
    items: [
      { id: "4", title: "Verkehrsunfall A7", time: "16:20", status: "abgeschlossen", tag: "wichtig" },
      { id: "5", title: "Atemweg Einsatz", time: "11:00", status: "abgeschlossen", tag: "lernen" },
    ],
  },
  {
    label: "Diese Woche",
    items: [
      { id: "6", title: "Sepsis Pflegeheim", time: "Mo, 09:30", status: "offen", tag: null },
      { id: "7", title: "ACS Verdacht", time: "So, 22:15", status: "abgeschlossen", tag: null },
    ],
  },
];

export function ReviewsList() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>("Alle");

  const filters = ["Alle", "Offen", "Abgeschlossen", "Lernen relevant"];

  // Filter logic
  const filteredData = mockData.map(group => ({
    ...group,
    items: group.items.filter(item => {
      if (activeFilter === "Alle") return true;
      if (activeFilter === "Offen") return item.status === "offen";
      if (activeFilter === "Abgeschlossen") return item.status === "abgeschlossen";
      if (activeFilter === "Lernen relevant") return item.tag === "lernen";
      return true;
    })
  })).filter(group => group.items.length > 0);

  const isEmpty = filteredData.length === 0;

  return (
    <div className="flex flex-col min-h-full bg-black text-neutral-100 pb-24">
      {/* Header & Sticky Area */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#2a2a2a] pb-3">
        {/* Nav Bar */}
        <div className="flex items-center justify-between p-4 pt-12 md:pt-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] text-neutral-400 active:scale-95 transition-transform border border-[#2a2a2a]">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-white">Nachbereitungen</h1>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] text-neutral-400 active:scale-95 transition-transform border border-[#2a2a2a]">
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-1 snap-x">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap snap-center active:scale-95 transition-all border",
                activeFilter === filter
                  ? "bg-amber-500 text-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  : "bg-[#1a1a1a] text-neutral-400 border-[#2a2a2a] hover:bg-[#222]"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-6">
        {/* Summary Card - only show on 'Alle' to save space when filtering */}
        {activeFilter === "Alle" && <ReviewSummaryCard />}

        {/* Content List */}
        {isEmpty ? (
          <EmptyState filter={activeFilter} clearFilter={() => setActiveFilter("Alle")} />
        ) : (
          <div className="flex flex-col gap-6">
            {filteredData.map((group, idx) => (
              <DayGroupSection key={idx} group={group} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Subcomponents

function ReviewSummaryCard() {
  return (
    <div className="bg-gradient-to-br from-[#16161a] to-[#121212] rounded-[2rem] border border-[#2a2a2a] p-5 flex flex-col gap-4 shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-500" /> Deine Übersicht
        </h2>
        <span className="text-xs font-medium text-neutral-500">Letzte 7 Tage</span>
      </div>

      <div className="flex justify-between items-center bg-[#0a0a0a] rounded-xl border border-[#2a2a2a] p-3">
        <div className="flex flex-col items-center flex-1 border-r border-[#2a2a2a]">
          <span className="text-xl font-bold text-amber-500">2</span>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 mt-0.5">Offen</span>
        </div>
        <div className="flex flex-col items-center flex-1 border-r border-[#2a2a2a]">
          <span className="text-xl font-bold text-white">6</span>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 mt-0.5">Woche</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <span className="text-xl font-bold text-purple-400">3</span>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 mt-0.5">Lernen</span>
        </div>
      </div>

      <button className="w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 py-3 rounded-xl text-sm font-bold transition-colors active:scale-95 flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" /> Neue Nachbereitung
      </button>
    </div>
  );
}

function DayGroupSection({ group }: { group: DayGroup }) {
  const openCount = group.items.filter(i => i.status === "offen").length;
  const closedCount = group.items.filter(i => i.status === "abgeschlossen").length;

  return (
    <section className="flex flex-col gap-3">
      {/* DayGroupHeader */}
      <div className="flex items-center justify-between px-1 sticky top-[110px] md:top-[90px] bg-[#0a0a0a]/95 backdrop-blur-md py-2 z-20">
        <div className="flex items-center gap-2">
          <h3 className="text-[13px] font-bold text-white">{group.label}</h3>
          <span className="text-[11px] font-semibold text-neutral-500 bg-[#1a1a1a] px-1.5 py-0.5 rounded-md border border-[#2a2a2a]">
            {group.items.length}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium text-neutral-500">
          {closedCount > 0 && <span>{closedCount} abgeschlossen</span>}
          {closedCount > 0 && openCount > 0 && <span>·</span>}
          {openCount > 0 && <span className="text-amber-500/80">{openCount} offen</span>}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {group.items.map((item) => (
          <ReviewListItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function ReviewListItem({ item }: { item: ReviewItem }) {
  const isOpen = item.status === "offen";

  return (
    <Link to={`/learn/review/${item.id}`} className={cn(
      "flex flex-col p-3.5 bg-[#121212] rounded-2xl border active:scale-[0.98] transition-transform",
      isOpen ? "border-amber-500/30 bg-amber-500/5" : "border-[#2a2a2a]"
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={item.status} />
            {item.tag === "lernen" && (
              <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-purple-400 bg-purple-500/10 border border-purple-500/20">
                <Brain className="w-3 h-3" /> Lernen
              </span>
            )}
            {item.tag === "wichtig" && (
              <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-red-400 bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-3 h-3" /> Wichtig
              </span>
            )}
          </div>
          <h4 className={cn("font-bold text-[15px] mt-0.5", isOpen ? "text-amber-50" : "text-neutral-200")}>
            {item.title}
          </h4>
          <span className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5 font-medium">
            <Clock className="w-3.5 h-3.5" /> {item.time}
          </span>
        </div>
        <div className="shrink-0 mt-1">
          <ChevronRight className={cn("w-5 h-5", isOpen ? "text-amber-500/50" : "text-neutral-600")} />
        </div>
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: ReviewStatus }) {
  const isOpen = status === "offen";
  return (
    <span className={cn(
      "flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border",
      isOpen 
        ? "text-amber-500 bg-amber-500/10 border-amber-500/20" 
        : "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    )}>
      {isOpen ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
      {status}
    </span>
  );
}

function EmptyState({ filter, clearFilter }: { filter: string, clearFilter: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 mt-8 bg-[#121212] rounded-3xl border border-[#2a2a2a] border-dashed">
      <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center border border-[#2a2a2a] mb-4">
        <Filter className="w-8 h-8 text-neutral-500" />
      </div>
      <h3 className="text-lg font-bold text-white">Keine Einträge</h3>
      <p className="text-sm text-neutral-400 mt-2 max-w-[250px]">
        Wir konnten keine Nachbereitungen für den Filter <strong className="text-amber-500">"{filter}"</strong> finden.
      </p>
      <button 
        onClick={clearFilter}
        className="mt-6 px-6 py-2.5 bg-[#1a1a1a] hover:bg-[#222] text-white rounded-xl text-sm font-semibold transition-colors border border-[#2a2a2a] active:scale-95"
      >
        Filter zurücksetzen
      </button>
    </div>
  );
}
