import { Search, ChevronRight, Syringe, Pill, Beaker } from 'lucide-react';
import { useState } from 'react';

interface MedicationsTabProps {
  onSelectMedication: (id: string) => void;
  onOpenSearch: () => void;
}

export function MedicationsTab({ onSelectMedication, onOpenSearch }: MedicationsTabProps) {
  const categories = [
    { id: 'all', label: 'All Meds' },
    { id: 'resus', label: 'Resuscitation' },
    { id: 'analgesia', label: 'Analgesia' },
    { id: 'resp', label: 'Respiratory' },
  ];
  
  const [activeCategory, setActiveCategory] = useState('all');

  const medications = [
    { id: 'epi', name: 'Epinephrine', type: 'Vasopressor', icon: Syringe, color: 'text-sky-400', category: 'resus' },
    { id: 'amio', name: 'Amiodarone', type: 'Antiarrhythmic', icon: Pill, color: 'text-emerald-400', category: 'resus' },
    { id: 'fentanyl', name: 'Fentanyl', type: 'Analgesic', icon: Beaker, color: 'text-purple-400', category: 'analgesia' },
    { id: 'albuterol', name: 'Albuterol', type: 'Bronchodilator', icon: Pill, color: 'text-amber-400', category: 'resp' },
    { id: 'naloxone', name: 'Naloxone', type: 'Antidote', icon: Syringe, color: 'text-red-400', category: 'all' },
    { id: 'atropine', name: 'Atropine', type: 'Anticholinergic', icon: Syringe, color: 'text-emerald-400', category: 'resus' },
    { id: 'ketamine', name: 'Ketamine', type: 'Analgesic', icon: Beaker, color: 'text-purple-400', category: 'analgesia' },
  ];

  const filteredMeds = activeCategory === 'all' 
    ? medications 
    : medications.filter(m => m.category === activeCategory || m.category === 'all');

  return (
    <div className="flex-1 overflow-y-auto px-5 pb-32 animate-in fade-in duration-200">
      <header className="pt-12 pb-4 space-y-5 sticky top-0 bg-[#09090b]/95 backdrop-blur-xl z-10 border-b border-zinc-900/50">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Medications</h1>
          <p className="text-zinc-500 text-[15px] font-medium">Local index loaded (Offline)</p>
        </div>

        {/* Fake Search Input to trigger actual search overlay */}
        <div className="relative group cursor-pointer" onClick={onOpenSearch}>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="size-5 text-zinc-500" />
          </div>
          <div className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-2xl py-3 pl-12 pr-4 shadow-sm flex items-center group-active:scale-[0.98] transition-all">
            <span className="text-zinc-500 text-base font-medium">Search index...</span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-2.5 no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap text-[14px] font-bold transition-all active:scale-95 ${
                activeCategory === cat.id
                  ? 'bg-zinc-100 text-zinc-950'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 shadow-sm active:bg-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      <div className="pt-4 space-y-3">
        {filteredMeds.map((med) => (
          <button
            key={med.id}
            onClick={() => onSelectMedication(med.id)}
            className="w-full bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 flex items-center justify-between active:bg-zinc-800 active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={`size-12 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-center shadow-inner group-active:border-zinc-700 transition-colors`}>
                <med.icon className={`size-6 ${med.color}`} />
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="text-zinc-100 font-bold text-[17px] group-active:text-white">{med.name}</span>
                <span className="text-[14px] text-zinc-500 font-medium">{med.type}</span>
              </div>
            </div>
            <div className="flex items-center">
              <ChevronRight className="size-5 text-zinc-600 group-active:text-zinc-400 transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}