import { User, Settings, Info, CloudOff, FileDown, MessageSquare, ChevronRight, ShieldCheck } from 'lucide-react';

export function MoreTab() {
  const sections = [
    {
      title: 'Data & Sync',
      items: [
        { icon: CloudOff, label: 'Offline Index', sub: 'Last synced 2h ago', color: 'text-emerald-400' },
        { icon: FileDown, label: 'Protocol Updates', sub: 'Check for new versions', color: 'text-sky-400' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Settings, label: 'App Settings', sub: 'Theme, text size, units', color: 'text-zinc-400' },
        { icon: User, label: 'Profile & Credentials', sub: 'Paramedic ID: 89432', color: 'text-zinc-400' },
      ]
    },
    {
      title: 'About',
      items: [
        { icon: ShieldCheck, label: 'Compliance & Legal', sub: 'Terms of Use', color: 'text-amber-400' },
        { icon: MessageSquare, label: 'Report Issue', sub: 'Send feedback to admin', color: 'text-zinc-400' },
        { icon: Info, label: 'App Info', sub: 'Version 4.2.1', color: 'text-zinc-400' },
      ]
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto px-5 pb-32 animate-in fade-in duration-200">
      <header className="pt-12 pb-6 space-y-5 sticky top-0 bg-[#09090b]/95 backdrop-blur-xl z-10 border-b border-zinc-900/50">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">More</h1>
          <p className="text-zinc-500 text-[15px] font-medium">Settings and offline status</p>
        </div>
      </header>

      <div className="pt-6 space-y-8">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-zinc-500 px-1">{section.title}</h2>
            <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-[1.5rem] overflow-hidden">
              {section.items.map((item, itemIdx) => (
                <button
                  key={itemIdx}
                  className={`w-full p-4 flex items-center justify-between active:bg-zinc-800/80 transition-colors group ${
                    itemIdx !== section.items.length - 1 ? 'border-b border-zinc-800/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`size-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-inner`}>
                      <item.icon className={`size-5 ${item.color}`} />
                    </div>
                    <div className="flex flex-col items-start text-left">
                      <span className="text-zinc-100 font-bold text-[16px] group-active:text-white">{item.label}</span>
                      <span className="text-[13px] text-zinc-500 font-medium">{item.sub}</span>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-zinc-600 group-active:text-zinc-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}