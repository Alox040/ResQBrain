import { useState } from 'react';
import { 
  Home, 
  Search, 
  Pill, 
  GitBranch, 
  Heart, 
  MoreHorizontal, 
  BookOpen, 
  Clock, 
  Zap, 
  Activity,
  Mic,
  ChevronRight,
  TrendingUp,
  History,
  AlertTriangle
} from 'lucide-react';
import { BottomNav } from './components/BottomNav';
import { FloatingSearch } from './components/FloatingSearch';
import { MedicationDetail } from './components/MedicationDetail';
import { AlgorithmDetail } from './components/AlgorithmDetail';
import { QuickMode } from './components/QuickMode';

import { MedicationsTab } from './components/MedicationsTab';
import { AlgorithmsTab } from './components/AlgorithmsTab';
import { MoreTab } from './components/MoreTab';
import { OnboardingScreen } from './components/OnboardingScreen';

const statuses = [
  { id: '1', label: 'Status 1', desc: 'Frei', color: 'bg-emerald-500', shadow: 'shadow-[0_0_8px_rgba(16,185,129,0.3)]' },
  { id: '2', label: 'Status 2', desc: 'Einsatzbereit', color: 'bg-emerald-400', shadow: 'shadow-[0_0_8px_rgba(52,211,153,0.3)]' },
  { id: '3', label: 'Status 3', desc: 'Einsatz übernommen', color: 'bg-amber-500', shadow: 'shadow-[0_0_8px_rgba(245,158,11,0.3)]' },
  { id: '5', label: 'Status 5', desc: 'Sprechwunsch', color: 'bg-purple-500', shadow: 'shadow-[0_0_8px_rgba(168,85,247,0.3)]' },
  { id: '6', label: 'Status 6', desc: 'Nicht einsatzbereit', color: 'bg-red-500', shadow: 'shadow-[0_0_8px_rgba(239,68,68,0.3)]' },
];

export default function App() {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<string | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);
  const [quickModeOpen, setQuickModeOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(statuses[1]);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const quickActions = [
    { icon: Pill, label: 'Medications', bg: 'bg-gradient-to-b from-zinc-800 to-zinc-900', border: 'border-t border-zinc-700/50 border-x border-zinc-800 border-b-[4px] border-b-zinc-950', iconColor: 'text-sky-400', shadow: 'shadow-[0_4px_12px_rgba(0,0,0,0.6)]' },
    { icon: GitBranch, label: 'Algorithms', bg: 'bg-gradient-to-b from-zinc-800 to-zinc-900', border: 'border-t border-zinc-700/50 border-x border-zinc-800 border-b-[4px] border-b-zinc-950', iconColor: 'text-emerald-400', shadow: 'shadow-[0_4px_12px_rgba(0,0,0,0.6)]' },
    { icon: BookOpen, label: 'Protocols', bg: 'bg-gradient-to-b from-zinc-800 to-zinc-900', border: 'border-t border-zinc-700/50 border-x border-zinc-800 border-b-[4px] border-b-zinc-950', iconColor: 'text-purple-400', shadow: 'shadow-[0_4px_12px_rgba(0,0,0,0.6)]' },
    { icon: Heart, label: 'Favorites', bg: 'bg-gradient-to-b from-zinc-800 to-zinc-900', border: 'border-t border-zinc-700/50 border-x border-zinc-800 border-b-[4px] border-b-zinc-950', iconColor: 'text-red-400', shadow: 'shadow-[0_4px_12px_rgba(0,0,0,0.6)]' },
  ];

  const recentItems = [
    { name: 'Epinephrine', category: 'Medication', time: '2m ago', icon: Pill, color: 'text-sky-400', id: 'epi' },
    { name: 'Cardiac Arrest', category: 'Algorithm', time: '5m ago', icon: GitBranch, color: 'text-emerald-400', id: 'cardiac' },
    { name: 'Amiodarone', category: 'Medication', time: '12m ago', icon: Pill, color: 'text-sky-400', id: 'amio' },
  ];

  const handleRecentClick = (item: typeof recentItems[0]) => {
    if (item.category === 'Algorithm') {
      setSelectedAlgorithm(item.id);
    } else if (item.category === 'Medication') {
      setSelectedMedication(item.id);
    }
  };

  const favorites = [
    { name: 'Pediatric Dosing', category: 'Protocol', icon: BookOpen, color: 'text-purple-400' },
    { name: 'Stroke Protocol', category: 'Algorithm', icon: GitBranch, color: 'text-emerald-400' },
    { name: 'Naloxone', category: 'Medication', icon: Pill, color: 'text-sky-400' },
  ];

  return (
    <div className="size-full bg-[#09090b] text-zinc-50 flex flex-col font-sans">
      {!hasAcceptedTerms && (
        <OnboardingScreen onAccept={() => setHasAcceptedTerms(true)} />
      )}

      {/* Important Info Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 flex items-center justify-center gap-2 z-50 shrink-0">
        <AlertTriangle className="size-4 text-amber-500" />
        <span className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mt-[1px]">Reference only – follow local protocols</span>
      </div>

      {/* Conditional Tabs Rendering */}
      {activeTab === 'home' && (
        <div className="flex flex-col flex-1 overflow-hidden animate-in fade-in duration-200">
          {/* Header section with top padding for mobile status bar */}
          <header className="px-5 pt-8 pb-6 space-y-7 bg-[#09090b]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-zinc-400 text-[15px] font-medium mb-0.5">Good evening,</h2>
                <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Paramedic Smith</h1>
              </div>
          <div className="relative">
            <button 
              onClick={() => setStatusModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-b from-zinc-800 to-zinc-900 border-t border-zinc-700/50 border-x border-b border-zinc-800 rounded-full py-1.5 pl-2.5 pr-3.5 active:scale-95 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            >
              <div className={`size-3.5 rounded-full ${currentStatus.color} ${currentStatus.shadow} border border-black/20`}></div>
              <span className="text-sm font-bold text-zinc-200">{currentStatus.id}</span>
            </button>
            
            {statusModalOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setStatusModalOpen(false)}></div>
                <div className="absolute top-full right-0 mt-3 w-60 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-200">
                  {statuses.map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setCurrentStatus(s);
                        setStatusModalOpen(false);
                      }}
                      className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl active:bg-zinc-800 hover:bg-zinc-800/50 transition-colors text-left"
                    >
                      <div className={`size-3.5 rounded-full flex-shrink-0 ${s.color} border border-black/20`}></div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-bold text-zinc-200">{s.label}</span>
                        <span className="text-xs text-zinc-500 font-medium">{s.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group cursor-pointer" onClick={() => setSearchOpen(true)}>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="size-5 text-zinc-500 group-active:text-sky-400 transition-colors" />
          </div>
          <div className="w-full bg-zinc-950 border-t border-zinc-900 border-x border-b-[2px] border-zinc-800/80 text-zinc-100 rounded-full py-3.5 pl-12 pr-12 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] flex items-center group-active:border-b group-active:translate-y-[1px] group-active:border-sky-500/40 transition-all">
            <span className="text-zinc-500 text-base font-medium">Search medications, algorithms...</span>
          </div>
          <button className="absolute inset-y-0 right-0 pr-3 flex items-center active:scale-95 transition-transform" onClick={(e) => { e.stopPropagation(); /* mic action */ }}>
            <div className="bg-gradient-to-b from-zinc-700 to-zinc-800 p-1.5 rounded-full border-t border-zinc-600/50 border-x border-b border-zinc-800 shadow-sm">
              <Mic className="size-4 text-zinc-200" />
            </div>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-5 pb-32 space-y-8">
        
        {/* Last Used Gimmick */}
        <section className="mt-[-10px]">
          <button 
            onClick={() => setSelectedMedication('epi')}
            className="flex items-center gap-3 bg-zinc-900 border-t border-zinc-700/50 border-x border-zinc-800 border-b-[2px] border-b-zinc-950 rounded-full py-2 pr-4 pl-2 active:border-b active:translate-y-[1px] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
          >
            <div className="relative flex items-center justify-center bg-zinc-950 rounded-full size-6 shadow-inner border border-zinc-800/80">
              <span className="absolute size-2 bg-sky-500 rounded-full animate-ping opacity-60"></span>
              <span className="relative size-1.5 bg-sky-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]"></span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Last</span>
              <div className="h-3 w-[1px] bg-zinc-800 rounded-full"></div>
              <span className="text-[13px] font-bold text-zinc-100">Epinephrine</span>
              <span className="text-[11px] font-semibold text-zinc-500">2m ago</span>
            </div>
            <ChevronRight className="size-3.5 text-zinc-600 ml-auto" />
          </button>
        </section>

        {/* Quick Actions Grid */}
        <section>
          <div className="grid grid-cols-2 gap-3.5">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (action.label === 'Medications') {
                    setSelectedMedication('epi'); // Default for demo
                  } else if (action.label === 'Algorithms') {
                    setSelectedAlgorithm('cardiac');
                  }
                }}
                className={`group relative overflow-hidden ${action.bg} ${action.border} rounded-[1.25rem] p-4 flex flex-col gap-3.5 active:border-b active:translate-y-[3px] transition-all active:brightness-95 text-left ${action.shadow}`}
              >
                <div className={`size-12 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]`}>
                  <action.icon className={`size-6 ${action.iconColor}`} />
                </div>
                <div className="flex flex-col items-start w-full">
                  <span className="text-zinc-100 font-bold tracking-wide text-base">{action.label}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-3.5 px-1">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-zinc-500">Recent History</h2>
            <button className="text-[14px] font-bold text-sky-500 active:text-sky-400 transition-colors py-1">View All</button>
          </div>
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden">
            {recentItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleRecentClick(item)}
                className={`w-full bg-zinc-900 active:bg-zinc-800/80 p-4 flex items-center justify-between transition-colors group ${
                  idx !== recentItems.length - 1 ? 'border-b border-zinc-800/50' : ''
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`size-11 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-center shadow-inner`}>
                    <item.icon className={`size-5 ${item.color}`} />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-zinc-100 font-semibold text-base group-active:text-white">{item.name}</span>
                    <span className="text-[14px] text-zinc-500 font-medium">{item.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[12px] font-bold text-zinc-500">{item.time}</span>
                  <ChevronRight className="size-5 text-zinc-600 group-active:text-zinc-400 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Pinned Favorites */}
        <section>
          <div className="flex items-center justify-between mb-3.5 px-1">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-zinc-500">Pinned Protocols</h2>
            <button className="text-[14px] font-bold text-sky-500 active:text-sky-400 transition-colors py-1">Edit</button>
          </div>
          <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden">
            {favorites.map((item, idx) => (
              <button
                key={idx}
                className={`w-full bg-zinc-900 active:bg-zinc-800/80 p-4 flex items-center justify-between transition-colors group ${
                  idx !== favorites.length - 1 ? 'border-b border-zinc-800/50' : ''
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`size-11 rounded-lg bg-zinc-950 border border-zinc-800/80 flex items-center justify-center shadow-inner`}>
                    <item.icon className={`size-5 ${item.color}`} />
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-zinc-100 font-semibold text-base group-active:text-white">{item.name}</span>
                    <span className="text-[14px] text-zinc-500 font-medium">{item.category}</span>
                  </div>
                </div>
                <Heart className="size-6 text-red-500/80 fill-red-500/20 group-active:fill-red-500/40 transition-colors" />
              </button>
            ))}
          </div>
        </section>
      </main>
      </div>
      )}

      {activeTab === 'medications' && (
        <MedicationsTab 
          onSelectMedication={setSelectedMedication} 
          onOpenSearch={() => setSearchOpen(true)}
        />
      )}

      {activeTab === 'algorithms' && (
        <AlgorithmsTab 
          onSelectAlgorithm={setSelectedAlgorithm} 
        />
      )}

      {activeTab === 'more' && (
        <MoreTab />
      )}

      {/* Quick Mode FAB */}
      <button
        onClick={() => setQuickModeOpen(true)}
        className="fixed bottom-28 right-5 size-[4.25rem] bg-gradient-to-b from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-[0_6px_16px_rgba(220,38,38,0.4)] border-t border-red-400/50 border-x border-red-700 border-b-[4px] border-b-red-800 active:border-b active:translate-y-[3px] transition-all z-30"
      >
        <Zap className="size-7 text-white fill-white" />
      </button>

      {/* Floating Search */}
      <FloatingSearch 
        open={searchOpen} 
        onOpenChange={setSearchOpen} 
        onSelectResult={(id) => {
          setSearchOpen(false);
          // For demo purposes, route 2 (Cardiac Arrest) to algorithm, everything else to medication
          if (id === 2 || id === 7) {
            setSelectedAlgorithm(id.toString());
          } else {
            setSelectedMedication(id.toString());
          }
        }}
      />

      {/* Detail Screens */}
      {selectedMedication && (
        <MedicationDetail 
          onBack={() => setSelectedMedication(null)} 
        />
      )}

      {selectedAlgorithm && (
        <AlgorithmDetail onBack={() => setSelectedAlgorithm(null)} />
      )}

      {/* Quick Mode Screen */}
      {quickModeOpen && (
        <QuickMode 
          onClose={() => setQuickModeOpen(false)}
          onOpenAlgorithms={() => {
            setQuickModeOpen(false);
            setSelectedAlgorithm('cardiac');
          }}
          onOpenMedications={() => {
            setQuickModeOpen(false);
            setSelectedMedication('epi');
          }}
          onOpenProtocols={() => {
            setQuickModeOpen(false);
          }}
          onOpenFavorites={() => {
            setQuickModeOpen(false);
          }}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} onSearchClick={() => setSearchOpen(true)} />
    </div>
  );
}
