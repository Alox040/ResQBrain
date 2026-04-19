import { Home, Search, Pill, GitBranch, MoreHorizontal } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSearchClick: () => void;
}

export function BottomNav({ activeTab, onTabChange, onSearchClick }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Search', action: 'search' },
    { id: 'medications', icon: Pill, label: 'Meds' },
    { id: 'algorithms', icon: GitBranch, label: 'Algos' },
    { id: 'more', icon: MoreHorizontal, label: 'More' },
  ];

  const handleTabClick = (tab: typeof tabs[0]) => {
    if (tab.action === 'search') {
      onSearchClick();
    } else {
      onTabChange(tab.id);
    }
  };

  return (
    <nav className="fixed bottom-6 left-4 right-4 z-40 pb-safe">
      <div className="bg-zinc-950/90 backdrop-blur-2xl border-t border-zinc-700/50 border-x border-b border-zinc-800 shadow-[0_8px_32px_rgba(0,0,0,0.8)] rounded-full px-1.5 py-1.5 flex items-center justify-between">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className="relative flex flex-col items-center justify-center flex-1 h-14 rounded-full active:scale-95 transition-all group overflow-hidden mx-0.5"
            >
              {isActive && (
                <div className="absolute inset-0 bg-zinc-800 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] border border-zinc-700/50" />
              )}
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <tab.icon 
                  className={`size-[22px] transition-all duration-300 ${
                    isActive 
                      ? 'text-sky-400' 
                      : 'text-zinc-500 group-hover:text-zinc-400'
                  }`} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
                <span 
                  className={`text-[10px] font-bold tracking-wide transition-colors duration-300 ${
                    isActive ? 'text-sky-400' : 'text-zinc-500'
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
