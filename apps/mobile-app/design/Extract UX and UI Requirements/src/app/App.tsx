import { useState } from 'react';
import { Search, Heart, Clock, Zap, ChevronRight, Star, AlertTriangle, Home as HomeIcon } from 'lucide-react';

function App() {
  const [activeScreen, setActiveScreen] = useState('emergency-home');

  const screens = [
    'emergency-home',
    'quick-med-lookup',
    'quick-algo-lookup',
    'medication-detail',
    'algorithm-detail',
    'favorites'
  ];

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Screen Selector - Dev Only */}
      <div className="bg-zinc-800 border-b border-zinc-700 p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-lg font-semibold mb-3 text-zinc-100">ResQBrain - Emergency Mode</h1>
          <div className="flex gap-2 flex-wrap">
            {screens.map(screen => (
              <button
                key={screen}
                onClick={() => setActiveScreen(screen)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  activeScreen === screen
                    ? 'bg-red-600 text-white'
                    : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                }`}
              >
                {screen.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Screen Display */}
      <div className="max-w-7xl mx-auto p-8">
        {activeScreen === 'emergency-home' && <EmergencyHomeScreen />}
        {activeScreen === 'quick-med-lookup' && <QuickMedLookupScreen />}
        {activeScreen === 'quick-algo-lookup' && <QuickAlgoLookupScreen />}
        {activeScreen === 'medication-detail' && <MedicationDetailScreen />}
        {activeScreen === 'algorithm-detail' && <AlgorithmDetailScreen />}
        {activeScreen === 'favorites' && <FavoritesScreen />}
      </div>
    </div>
  );
}

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

function PhoneFrame({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="max-w-md mx-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-zinc-100 mb-1">{title}</h2>
        <p className="text-red-400 text-sm flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Emergency Mode - Optimized for speed
        </p>
      </div>
      <div className="border-8 border-black rounded-[2.5rem] bg-black overflow-hidden shadow-2xl">
        <div className="rounded-[1.5rem] overflow-hidden bg-black">
          {children}
        </div>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="bg-black px-6 pt-3 pb-2 flex justify-between items-center text-white">
      <span className="text-xs font-medium">9:41</span>
      <div className="flex gap-2 items-center">
        <OfflineBadge />
      </div>
    </div>
  );
}

function OfflineBadge() {
  return (
    <div className="bg-amber-400 text-black px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
      </svg>
      <span className="text-[10px] font-bold">OFFLINE</span>
    </div>
  );
}

function EmergencyHeader({ title, showBack = false, onFavorite }: { title: string; showBack?: boolean; onFavorite?: () => void }) {
  return (
    <div className="bg-black border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        {showBack && (
          <button className="text-red-500 flex items-center gap-1 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
        )}
      </div>
      <div className="font-bold text-white text-lg absolute left-1/2 transform -translate-x-1/2 truncate max-w-[50%]">
        {title}
      </div>
      <div className="flex items-center gap-2">
        {onFavorite && (
          <button onClick={onFavorite} className="text-red-500">
            <Star className="w-5 h-5 fill-red-500" />
          </button>
        )}
      </div>
    </div>
  );
}

function QuickAccessButton({ 
  icon, 
  label, 
  sublabel, 
  variant = 'default',
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  sublabel?: string;
  variant?: 'default' | 'primary' | 'danger';
  onClick?: () => void;
}) {
  const baseClasses = "w-full rounded-xl p-4 transition-all active:scale-95 flex items-center gap-4";
  
  const variantClasses = {
    default: "bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600",
    primary: "bg-red-950 border-2 border-red-600 hover:bg-red-900",
    danger: "bg-red-950 border-2 border-red-500 hover:bg-red-900"
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} onClick={onClick}>
      <div className={variant === 'default' ? 'text-zinc-400' : 'text-red-400'}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <div className="text-white font-bold text-lg">{label}</div>
        {sublabel && (
          <div className={`text-sm ${variant === 'default' ? 'text-zinc-500' : 'text-red-300'}`}>
            {sublabel}
          </div>
        )}
      </div>
      <ChevronRight className={`w-6 h-6 ${variant === 'default' ? 'text-zinc-600' : 'text-red-400'}`} />
    </button>
  );
}

function QuickSearchBar({ 
  placeholder = "Search...", 
  value = "", 
  autoFocus = false,
  onChange
}: { 
  placeholder?: string; 
  value?: string; 
  autoFocus?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <div className={`bg-zinc-800 rounded-xl px-4 py-4 flex items-center gap-3 ${
      autoFocus ? 'ring-2 ring-red-600' : ''
    }`}>
      <Search className="w-6 h-6 text-red-500" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="flex-1 bg-transparent text-white placeholder-zinc-500 text-xl outline-none font-medium"
        autoFocus={autoFocus}
      />
      {value && (
        <button onClick={() => onChange?.('')}>
          <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

function AlphabetJumpBar({ onLetterClick }: { onLetterClick?: (letter: string) => void }) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  return (
    <div className="flex flex-wrap gap-1 justify-between">
      {alphabet.map(letter => (
        <button
          key={letter}
          onClick={() => onLetterClick?.(letter)}
          className="w-7 h-7 flex items-center justify-center bg-zinc-800 hover:bg-red-600 text-zinc-400 hover:text-white text-xs font-bold rounded transition-colors"
        >
          {letter}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// SCREENS
// ============================================================================

function EmergencyHomeScreen() {
  return (
    <PhoneFrame title="Emergency Home">
      <StatusBar />
      <div className="bg-black border-b border-zinc-900 px-5 py-4 flex items-center justify-between">
        <div className="font-bold text-white text-2xl">ResQBrain</div>
        <OfflineBadge />
      </div>
      
      <div className="bg-black min-h-[700px] pb-20">
        {/* ULTRA MINIMAL: Only spacing + typography + thin dividers */}
        <div className="px-5">
          
          {/* Search - Maximum emphasis through size and spacing only */}
          <div className="pt-8 pb-8">
            <div className="flex items-center gap-4 pb-4 border-b border-zinc-900">
              <Search className="w-7 h-7 text-red-500 flex-shrink-0" strokeWidth={2} />
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 bg-transparent text-white placeholder-zinc-700 text-2xl outline-none font-normal"
                autoFocus
              />
            </div>
          </div>

          {/* Quick Access - Typography weight creates hierarchy */}
          <div className="pb-8">
            <div className="text-[10px] font-semibold text-zinc-700 uppercase tracking-widest mb-4">Quick Access</div>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-4 py-4 -mx-5 px-5 hover:bg-zinc-950/50 transition-colors active:bg-zinc-950">
                <Search className="w-5 h-5 text-zinc-600 flex-shrink-0" strokeWidth={2} />
                <span className="text-white text-lg font-medium">Medications</span>
              </button>
              <button className="w-full flex items-center gap-4 py-4 -mx-5 px-5 hover:bg-zinc-950/50 transition-colors active:bg-zinc-950">
                <AlertTriangle className="w-5 h-5 text-zinc-600 flex-shrink-0" strokeWidth={2} />
                <span className="text-white text-lg font-medium">Algorithms</span>
              </button>
            </div>
          </div>

          {/* Favorites - Ultra clean list */}
          <div className="pb-8 border-t border-zinc-900 pt-8">
            <div className="text-[10px] font-semibold text-zinc-700 uppercase tracking-widest mb-4">Favorites</div>
            <div className="space-y-0 divide-y divide-zinc-900">
              <button className="w-full flex items-center gap-4 py-4 -mx-5 px-5 hover:bg-zinc-950/50 transition-colors active:bg-zinc-950">
                <Star className="w-4 h-4 text-red-500 flex-shrink-0 fill-red-500" strokeWidth={2} />
                <div className="flex-1 text-left min-w-0">
                  <div className="text-white font-medium text-base">Adrenaline</div>
                  <div className="text-zinc-600 text-sm font-mono">1 mg IV</div>
                </div>
              </button>
              <button className="w-full flex items-center gap-4 py-4 -mx-5 px-5 hover:bg-zinc-950/50 transition-colors active:bg-zinc-950">
                <Star className="w-4 h-4 text-red-500 flex-shrink-0 fill-red-500" strokeWidth={2} />
                <div className="flex-1 text-left min-w-0">
                  <div className="text-white font-medium text-base">Cardiac Arrest</div>
                  <div className="text-zinc-600 text-sm">ACLS Protocol</div>
                </div>
              </button>
              <button className="w-full flex items-center gap-4 py-4 -mx-5 px-5 hover:bg-zinc-950/50 transition-colors active:bg-zinc-950">
                <Star className="w-4 h-4 text-red-500 flex-shrink-0 fill-red-500" strokeWidth={2} />
                <div className="flex-1 text-left min-w-0">
                  <div className="text-white font-medium text-base">Polytrauma</div>
                  <div className="text-zinc-600 text-sm">Major trauma</div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent - Minimal emphasis */}
          <div className="pb-8">
            <div className="text-[10px] font-semibold text-zinc-700 uppercase tracking-widest mb-4">Recent</div>
            <div className="space-y-0 divide-y divide-zinc-900">
              <button className="w-full flex items-center gap-4 py-4 -mx-5 px-5 hover:bg-zinc-950/50 transition-colors active:bg-zinc-950">
                <div className="flex-1 text-left min-w-0">
                  <div className="text-white font-medium text-base">Atropine</div>
                  <div className="text-zinc-600 text-sm">Anticholinergic</div>
                </div>
              </button>
              <button className="w-full flex items-center gap-4 py-4 -mx-5 px-5 hover:bg-zinc-950/50 transition-colors active:bg-zinc-950">
                <div className="flex-1 text-left min-w-0">
                  <div className="text-white font-medium text-base">STEMI Protocol</div>
                  <div className="text-zinc-600 text-sm">ST-Elevation MI</div>
                </div>
              </button>
            </div>
          </div>

          {/* Critical - Emphasis through red accent only */}
          <div className="pb-8 border-t border-zinc-900 pt-8">
            <div className="text-[10px] font-semibold text-red-600 uppercase tracking-widest mb-4">Critical Protocols</div>
            <div className="space-y-0 divide-y divide-zinc-900">
              <button className="w-full flex items-center gap-4 py-4 -mx-5 px-5 hover:bg-red-950/10 transition-colors active:bg-red-950/20 border-l-2 border-red-600">
                <div className="flex-1 text-left min-w-0">
                  <div className="text-white font-semibold text-base">Cardiac Arrest</div>
                  <div className="text-red-400 text-sm">Immediate action required</div>
                </div>
              </button>
              <button className="w-full flex items-center gap-4 py-4 -mx-5 px-5 hover:bg-red-950/10 transition-colors active:bg-red-950/20 border-l-2 border-red-600">
                <div className="flex-1 text-left min-w-0">
                  <div className="text-white font-semibold text-base">Anaphylaxis</div>
                  <div className="text-red-400 text-sm">Time critical</div>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>

      <EmergencyTabBar active="home" />
    </PhoneFrame>
  );
}

function QuickMedLookupScreen() {
  const [searchValue, setSearchValue] = useState('');

  const medications = [
    { name: 'Adenosine', category: 'A', generic: 'Antiarrhythmic', dose: '6 mg IV' },
    { name: 'Adrenaline', category: 'A', generic: 'Epinephrine', dose: '1 mg IV', isFavorite: true },
    { name: 'Amiodarone', category: 'A', generic: 'Antiarrhythmic', dose: '300 mg IV' },
    { name: 'Atropine', category: 'A', generic: 'Anticholinergic', dose: '0.5 mg IV' },
    { name: 'Fentanyl', category: 'F', generic: 'Opioid analgesic', dose: '50-100 mcg IV' },
    { name: 'Ketamine', category: 'K', generic: 'Dissociative', dose: '1-2 mg/kg IV' },
    { name: 'Midazolam', category: 'M', generic: 'Benzodiazepine', dose: '2-5 mg IV' },
    { name: 'Morphine', category: 'M', generic: 'Opioid analgesic', dose: '2-10 mg IV' },
  ];

  const filtered = medications.filter(med => 
    med.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    med.generic.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <PhoneFrame title="Quick Medication Lookup">
      <StatusBar />
      <EmergencyHeader title="Medications" showBack />
      
      <div className="bg-black">
        {/* Sticky Search + Alphabet */}
        <div className="p-4 border-b border-zinc-800 bg-black sticky top-0 z-20 space-y-3">
          <QuickSearchBar 
            placeholder="Type medication name..." 
            autoFocus 
            value={searchValue}
            onChange={setSearchValue}
          />
          <AlphabetJumpBar />
        </div>

        {/* Results */}
        <div className="min-h-[600px] pb-20">
          {searchValue && (
            <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800">
              <div className="text-xs font-bold text-red-400 tracking-wider">
                {filtered.length} RESULTS
              </div>
            </div>
          )}

          <div className="divide-y divide-zinc-800">
            {filtered.map((med, idx) => (
              <button
                key={idx}
                className="w-full px-4 py-4 flex items-center gap-4 bg-black hover:bg-zinc-900 transition-colors active:bg-zinc-800"
              >
                {med.isFavorite && (
                  <Star className="w-5 h-5 fill-red-500 text-red-500 flex-shrink-0" />
                )}
                <div className="flex-1 text-left min-w-0">
                  <div className="text-white font-bold text-xl">{med.name}</div>
                  <div className="text-zinc-500 text-sm">{med.generic}</div>
                  <div className="text-red-400 text-sm font-mono font-bold mt-0.5">{med.dose}</div>
                </div>
                <ChevronRight className="w-6 h-6 text-zinc-600 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <EmergencyTabBar active="meds" />
    </PhoneFrame>
  );
}

function QuickAlgoLookupScreen() {
  const [searchValue, setSearchValue] = useState('');

  const algorithms = [
    { name: 'Anaphylaxis', category: 'Emergency', steps: 6, critical: true },
    { name: 'Cardiac Arrest', category: 'ACLS', steps: 8, critical: true, isFavorite: true },
    { name: 'Bradycardia', category: 'Cardiac', steps: 5, critical: false },
    { name: 'Head Injury', category: 'Trauma', steps: 7, critical: false },
    { name: 'Polytrauma', category: 'Trauma', steps: 12, critical: true, isFavorite: true },
    { name: 'Seizure', category: 'Neuro', steps: 6, critical: false },
    { name: 'STEMI', category: 'Cardiac', steps: 6, critical: true },
    { name: 'Stroke', category: 'Neuro', steps: 9, critical: true },
  ];

  const filtered = algorithms.filter(algo => 
    algo.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    algo.category.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <PhoneFrame title="Quick Algorithm Lookup">
      <StatusBar />
      <EmergencyHeader title="Algorithms" showBack />
      
      <div className="bg-black">
        {/* Sticky Search */}
        <div className="p-4 border-b border-zinc-800 bg-black sticky top-0 z-20">
          <QuickSearchBar 
            placeholder="Type protocol name..." 
            autoFocus 
            value={searchValue}
            onChange={setSearchValue}
          />
        </div>

        {/* Quick Filter Tags */}
        <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 overflow-x-auto">
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-full whitespace-nowrap">
              Critical
            </button>
            <button className="px-3 py-1.5 bg-zinc-800 text-zinc-400 text-xs font-bold rounded-full whitespace-nowrap">
              Cardiac
            </button>
            <button className="px-3 py-1.5 bg-zinc-800 text-zinc-400 text-xs font-bold rounded-full whitespace-nowrap">
              Trauma
            </button>
            <button className="px-3 py-1.5 bg-zinc-800 text-zinc-400 text-xs font-bold rounded-full whitespace-nowrap">
              Neuro
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="min-h-[600px] pb-20">
          {searchValue && (
            <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800">
              <div className="text-xs font-bold text-red-400 tracking-wider">
                {filtered.length} PROTOCOLS
              </div>
            </div>
          )}

          <div className="divide-y divide-zinc-800">
            {filtered.map((algo, idx) => (
              <button
                key={idx}
                className={`w-full px-4 py-4 flex items-center gap-4 transition-colors active:scale-[0.99] ${
                  algo.critical 
                    ? 'bg-red-950/30 hover:bg-red-950/50 border-l-4 border-red-600' 
                    : 'bg-black hover:bg-zinc-900'
                }`}
              >
                {algo.isFavorite && (
                  <Star className="w-5 h-5 fill-red-500 text-red-500 flex-shrink-0" />
                )}
                {algo.critical && !algo.isFavorite && (
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                )}
                <div className="flex-1 text-left min-w-0">
                  <div className="text-white font-bold text-xl">{algo.name}</div>
                  <div className="text-zinc-500 text-sm">{algo.category} • {algo.steps} steps</div>
                  {algo.critical && (
                    <div className="text-red-400 text-xs font-bold mt-1">TIME CRITICAL</div>
                  )}
                </div>
                <ChevronRight className="w-6 h-6 text-zinc-600 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <EmergencyTabBar active="algo" />
    </PhoneFrame>
  );
}

function MedicationDetailScreen() {
  const [isFavorite, setIsFavorite] = useState(true);

  return (
    <PhoneFrame title="Medication Detail">
      <StatusBar />
      <EmergencyHeader 
        title="Adrenaline" 
        showBack 
        onFavorite={() => setIsFavorite(!isFavorite)}
      />
      
      <div className="bg-black min-h-[700px] overflow-y-auto pb-20">
        <div className="p-4 space-y-3">
          {/* Emergency Dosage - Ultra Prominent */}
          <div className="bg-red-950 border-2 border-red-600 rounded-xl p-5 shadow-lg shadow-red-900/50">
            <div className="text-xs font-bold text-red-400 mb-2 tracking-wider flex items-center gap-2">
              <Zap className="w-3 h-3" />
              EMERGENCY DOSE
            </div>
            <div className="font-mono font-bold text-5xl text-white mb-2">1 mg IV</div>
            <div className="text-red-200 text-lg font-bold">Every 3-5 minutes</div>
          </div>

          {/* Pediatric Dosage */}
          <div className="bg-blue-950 border-2 border-blue-600 rounded-xl p-4">
            <div className="text-xs font-bold text-blue-400 mb-2 tracking-wider">PEDIATRIC DOSE</div>
            <div className="font-mono font-bold text-4xl text-white mb-1">0.01 mg/kg IV</div>
            <div className="text-blue-200 text-base">Maximum 1 mg per dose</div>
          </div>

          {/* Warning Banner */}
          <div className="bg-red-950 border-2 border-red-500 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
              <div>
                <div className="text-white font-bold text-lg mb-1">CONTRAINDICATION</div>
                <div className="text-red-200 text-base">
                  Severe hypertension, cardiac arrhythmias, angle-closure glaucoma
                </div>
              </div>
            </div>
          </div>

          {/* Quick Reference Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-bold text-lg mb-3">QUICK REFERENCE</div>
            <div className="space-y-3">
              <div>
                <div className="text-zinc-500 text-xs font-bold mb-1">ROUTE</div>
                <div className="text-white text-base">IV, IM, IO</div>
              </div>
              <div>
                <div className="text-zinc-500 text-xs font-bold mb-1">ONSET</div>
                <div className="text-white text-base">1-2 minutes (IV)</div>
              </div>
              <div>
                <div className="text-zinc-500 text-xs font-bold mb-1">DURATION</div>
                <div className="text-white text-base">5-10 minutes</div>
              </div>
            </div>
          </div>

          {/* Indications */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-bold text-lg mb-3">INDICATIONS</div>
            <ul className="space-y-2 text-zinc-300 text-base">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1 font-bold">•</span>
                <span><span className="font-bold text-white">Cardiac arrest</span> - Primary indication</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1 font-bold">•</span>
                <span><span className="font-bold text-white">Anaphylaxis</span> - Life-threatening</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1 font-bold">•</span>
                <span>Severe bradycardia</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1 font-bold">•</span>
                <span>Bronchospasm</span>
              </li>
            </ul>
          </div>

          {/* Side Effects */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-white font-bold text-lg mb-2">SIDE EFFECTS</div>
            <div className="text-zinc-300 text-base leading-relaxed">
              Hypertension, tachycardia, arrhythmias, anxiety, tremor. Use with caution in elderly patients.
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
              <Star className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
              {isFavorite ? 'Saved' : 'Save'}
            </button>
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-4 rounded-xl transition-colors">
              Share
            </button>
          </div>

          {/* Meta */}
          <div className="text-center text-xs text-zinc-600 pt-2">
            Last updated: Mar 2026 • v1.0
          </div>
        </div>
      </div>

      <EmergencyTabBar active="meds" />
    </PhoneFrame>
  );
}

function AlgorithmDetailScreen() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <PhoneFrame title="Algorithm Detail">
      <StatusBar />
      <EmergencyHeader title="Cardiac Arrest" showBack onFavorite={() => {}} />
      
      <div className="bg-black min-h-[700px] overflow-y-auto pb-20">
        <div className="p-4 space-y-3">
          {/* Progress Indicator */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white font-bold text-lg">ACLS Cardiac Arrest</div>
              <div className="text-red-400 font-bold text-sm">Step {currentStep}/8</div>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 8) * 100}%` }}
              />
            </div>
          </div>

          {/* Critical Warning */}
          <div className="bg-red-950 border-2 border-red-600 rounded-xl p-4 flex items-center gap-3 animate-pulse">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <div className="text-white font-bold text-lg">Time-critical procedure</div>
          </div>

          {/* Current Step - Highlighted */}
          <div className="bg-red-950 border-2 border-red-600 rounded-xl p-5 shadow-lg shadow-red-900/50">
            <div className="flex items-start gap-4">
              <div className="font-mono font-bold text-5xl text-red-400">1</div>
              <div className="flex-1">
                <div className="text-white font-bold text-2xl mb-2">Check responsiveness</div>
                <div className="text-red-200 text-lg leading-relaxed">
                  Tap shoulders and shout "Are you okay?"
                </div>
                <button 
                  onClick={() => setCurrentStep(2)}
                  className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
                >
                  Next Step →
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Steps - Collapsed */}
          <div className="space-y-2">
            {[
              { num: 2, title: 'Call for help', desc: 'Activate emergency response system' },
              { num: 3, title: 'Check pulse', desc: 'Carotid pulse for no more than 10 seconds' },
              { num: 4, title: 'Begin CPR', desc: '30 compressions : 2 breaths. Rate 100-120/min', critical: true },
              { num: 5, title: 'Attach AED/defibrillator', desc: 'Analyze rhythm as soon as available' },
            ].map((step) => (
              <button
                key={step.num}
                onClick={() => setCurrentStep(step.num)}
                className={`w-full rounded-xl p-4 transition-colors text-left ${
                  step.critical 
                    ? 'bg-zinc-900 border-2 border-red-600' 
                    : 'bg-zinc-900 border border-zinc-700'
                } hover:bg-zinc-800`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2">
                    {step.critical && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    <div className="font-mono font-bold text-xl text-zinc-500">{step.num}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-base">{step.title}</div>
                    <div className="text-zinc-500 text-sm mt-1">{step.desc}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-600 flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-4 rounded-xl transition-colors">
              Reset
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-colors">
              Complete
            </button>
          </div>

          {/* Meta */}
          <div className="text-center text-xs text-zinc-600 pt-2">
            Last updated: Mar 2026 • v1.0
          </div>
        </div>
      </div>

      <EmergencyTabBar active="algo" />
    </PhoneFrame>
  );
}

function FavoritesScreen() {
  return (
    <PhoneFrame title="Favorites">
      <StatusBar />
      <EmergencyHeader title="Favorites" />
      
      <div className="bg-black min-h-[700px] pb-20">
        <div className="p-4 space-y-4">
          {/* Medications Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-xs font-bold text-zinc-500 mb-3 tracking-wider flex items-center gap-2">
              <Star className="w-3 h-3" />
              MEDICATIONS (3)
            </div>
            <div className="space-y-2">
              <button className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 flex items-center gap-3 hover:bg-zinc-750 transition-colors">
                <Star className="w-5 h-5 fill-red-500 text-red-500" />
                <div className="flex-1 text-left">
                  <div className="text-white font-semibold text-lg">Adrenaline</div>
                  <div className="text-red-400 text-sm font-mono">1 mg IV • Every 3-5 min</div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-600" />
              </button>
              <button className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 flex items-center gap-3 hover:bg-zinc-750 transition-colors">
                <Star className="w-5 h-5 fill-red-500 text-red-500" />
                <div className="flex-1 text-left">
                  <div className="text-white font-semibold text-lg">Amiodarone</div>
                  <div className="text-red-400 text-sm font-mono">300 mg IV</div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-600" />
              </button>
              <button className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 flex items-center gap-3 hover:bg-zinc-750 transition-colors">
                <Star className="w-5 h-5 fill-red-500 text-red-500" />
                <div className="flex-1 text-left">
                  <div className="text-white font-semibold text-lg">Ketamine</div>
                  <div className="text-red-400 text-sm font-mono">1-2 mg/kg IV</div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-600" />
              </button>
            </div>
          </div>

          {/* Algorithms Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="text-xs font-bold text-zinc-500 mb-3 tracking-wider flex items-center gap-2">
              <Star className="w-3 h-3" />
              ALGORITHMS (2)
            </div>
            <div className="space-y-2">
              <button className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 flex items-center gap-3 hover:bg-zinc-750 transition-colors">
                <Star className="w-5 h-5 fill-red-500 text-red-500" />
                <div className="flex-1 text-left">
                  <div className="text-white font-semibold text-lg">Cardiac Arrest</div>
                  <div className="text-zinc-500 text-sm">ACLS • 8 steps</div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-600" />
              </button>
              <button className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 flex items-center gap-3 hover:bg-zinc-750 transition-colors">
                <Star className="w-5 h-5 fill-red-500 text-red-500" />
                <div className="flex-1 text-left">
                  <div className="text-white font-semibold text-lg">Polytrauma</div>
                  <div className="text-zinc-500 text-sm">Major trauma • 12 steps</div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-600" />
              </button>
            </div>
          </div>

          {/* Empty State Helper */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
            <Star className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <div className="text-zinc-400 text-sm">
              Tap the star icon on any medication or algorithm to add it to favorites for instant access
            </div>
          </div>
        </div>
      </div>

      <EmergencyTabBar active="favorites" />
    </PhoneFrame>
  );
}

function EmergencyTabBar({ active }: { active: string }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'meds', label: 'Meds', icon: Search },
    { id: 'algo', label: 'Algo', icon: AlertTriangle },
    { id: 'favorites', label: 'Saved', icon: Star }
  ];

  return (
    <div className="bg-black border-t border-zinc-800 px-2 py-2 flex justify-around">
      {tabs.map(tab => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors"
          >
            <Icon className={`w-6 h-6 ${active === tab.id ? 'text-red-500' : 'text-zinc-500'}`} />
            <div className={`text-[11px] font-medium ${active === tab.id ? 'text-red-500' : 'text-zinc-500'}`}>
              {tab.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default App;