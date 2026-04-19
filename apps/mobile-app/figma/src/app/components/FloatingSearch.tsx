import { Search, Mic, SlidersHorizontal, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface FloatingSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectResult: (id: string | number) => void;
}

export function FloatingSearch({ open, onOpenChange, onSelectResult }: FloatingSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const filters = ['All', 'Medications', 'Algorithms', 'Favorites', 'Recent'];

  const allResults = [
    { id: 1, title: 'Epinephrine', category: 'Medication', filterTypes: ['All', 'Medications', 'Recent'], catColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20', desc: '1mg/10ml (1:10,000) IV/IO push' },
    { id: 2, title: 'Cardiac Arrest', category: 'Algorithm', filterTypes: ['All', 'Algorithms', 'Recent'], catColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', desc: 'Adult Advanced Life Support (ACLS)' },
    { id: 3, title: 'Amiodarone', category: 'Medication', filterTypes: ['All', 'Medications'], catColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20', desc: '300mg IV/IO initial bolus dose' },
    { id: 4, title: 'Pediatric Protocol', category: 'Protocol', filterTypes: ['All', 'Favorites'], catColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20', desc: 'Pediatric emergency care guidelines' },
    { id: 5, title: 'Stroke Assessment', category: 'Protocol', filterTypes: ['All', 'Favorites', 'Recent'], catColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20', desc: 'Cincinnati Prehospital Stroke Scale' },
    { id: 6, title: 'Naloxone', category: 'Medication', filterTypes: ['All', 'Medications'], catColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20', desc: '0.4mg - 2mg IV/IN/IM for overdose' },
    { id: 7, title: 'Tachycardia', category: 'Algorithm', filterTypes: ['All', 'Algorithms'], catColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', desc: 'Adult with pulse algorithm' },
  ];

  const filteredResults = allResults.filter(
    (item) => 
      item.filterTypes.includes(activeFilter) && 
      (searchQuery === '' || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.desc.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b] flex flex-col font-sans animate-in fade-in zoom-in-95 duration-200">
      {/* Search Header */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-4 border-b border-zinc-900 bg-[#09090b]/90 backdrop-blur-xl z-10">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-500" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ResQBrain..."
            className="w-full bg-zinc-950 border-t border-zinc-900 border-x border-b border-zinc-800/50 rounded-full pl-12 pr-[5.5rem] py-3.5 text-base font-medium text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:border-sky-500/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            <button className="bg-gradient-to-b from-zinc-700 to-zinc-800 p-1.5 rounded-full border-t border-zinc-600/50 border-x border-b border-zinc-800 active:bg-zinc-700 transition-colors mr-1 shadow-sm">
              <Mic className="size-4 text-zinc-200" />
            </button>
            <div className="w-[1px] h-5 bg-zinc-800 mx-1"></div>
            <button className="p-2 rounded-full active:bg-zinc-800 text-zinc-400 transition-colors">
              <SlidersHorizontal className="size-4" />
            </button>
          </div>
        </div>
        <button
          onClick={() => onOpenChange(false)}
          className="text-zinc-400 font-medium px-2 py-3 active:text-zinc-200 transition-colors text-[15px]"
        >
          Cancel
        </button>
      </div>

      {/* Filters (Chips) */}
      <div className="pt-4 pb-2">
        <div className="flex overflow-x-auto gap-2.5 px-5 no-scrollbar pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap text-[15px] font-bold transition-all active:scale-95 ${
                activeFilter === filter
                  ? 'bg-sky-500 text-sky-950 shadow-[0_2px_8px_rgba(14,165,233,0.4)]'
                  : 'bg-zinc-900 text-zinc-400 border-t border-zinc-700/50 border-x border-b border-zinc-800 shadow-sm active:bg-zinc-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto px-5 pb-safe">
        <div className="space-y-3 py-4">
          {filteredResults.length > 0 ? (
            filteredResults.map((result) => (
              <button
                key={result.id}
                onClick={() => onSelectResult(result.id)}
                className="w-full text-left bg-zinc-900 border-t border-zinc-700/50 border-x border-b border-zinc-800 shadow-[0_2px_6px_rgba(0,0,0,0.3)] rounded-2xl p-4 flex items-center justify-between active:bg-zinc-800 active:scale-[0.98] transition-all group"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="text-zinc-100 font-bold text-[19px] tracking-tight truncate group-active:text-white">
                      {result.title}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest border shrink-0 ${result.catColor}`}
                    >
                      {result.category}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-[15px] leading-snug truncate">
                    {result.desc}
                  </p>
                </div>
                <div className="size-11 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 shadow-inner group-active:border-zinc-700 transition-colors">
                  <ChevronRight className="size-6 text-zinc-500 group-active:text-zinc-300" />
                </div>
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center pt-20 text-center px-4">
              <div className="size-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                <Search className="size-8 text-zinc-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-300 mb-2">No results found</h3>
              <p className="text-zinc-500 text-[15px]">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
