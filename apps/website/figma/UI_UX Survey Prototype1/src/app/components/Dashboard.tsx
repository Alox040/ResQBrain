import { Search, Heart, Clock, Pill, FileText, Star } from 'lucide-react';
import { useState } from 'react';

interface DashboardProps {
  onViewMedication: () => void;
  onViewAlgorithm: () => void;
}

export function Dashboard({ onViewMedication, onViewAlgorithm }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Medikamente, Algorithmen, Protokolle durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-destructive"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <QuickAction icon={<Heart />} label="Favoriten" count={12} />
        <QuickAction icon={<Clock />} label="Verlauf" count={24} />
        <QuickAction icon={<Search />} label="Suche" />
        <QuickAction icon={<FileText />} label="Referenzen" />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Medications */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Pill className="size-5 text-destructive" />
                <h2>Medikamente</h2>
              </div>
              <span className="text-sm text-muted-foreground">48 verfügbar</span>
            </div>

            <div className="space-y-3">
              {medications.map((med) => (
                <MedicationCard
                  key={med.id}
                  {...med}
                  onClick={onViewMedication}
                />
              ))}
            </div>

            <button className="w-full mt-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
              Alle Medikamente anzeigen →
            </button>
          </div>
        </div>

        {/* Algorithms */}
        <div>
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-destructive" />
                <h3>Algorithmen</h3>
              </div>
              <span className="text-sm text-muted-foreground">15</span>
            </div>

            <div className="space-y-3">
              {algorithms.map((algo) => (
                <AlgorithmCard
                  key={algo.id}
                  {...algo}
                  onClick={onViewAlgorithm}
                />
              ))}
            </div>
          </div>

          {/* Recent Updates */}
          <div className="bg-muted/50 border border-border rounded-xl p-6">
            <h4 className="mb-4">Letzte Aktualisierungen</h4>
            <div className="space-y-3">
              <UpdateItem
                title="Adrenalin Dosierung"
                date="Vor 2 Tagen"
                type="update"
              />
              <UpdateItem
                title="Reanimations-Protokoll"
                date="Vor 5 Tagen"
                type="new"
              />
              <UpdateItem
                title="Analgesie-Leitlinie"
                date="Vor 1 Woche"
                type="update"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
}

function QuickAction({ icon, label, count }: QuickActionProps) {
  return (
    <button className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl hover:shadow-md hover:border-destructive/50 transition-all">
      <div className="size-10 bg-destructive/10 text-destructive rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <span className="text-sm">{label}</span>
      {count && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </button>
  );
}

interface MedicationCardProps {
  name: string;
  category: string;
  favorite?: boolean;
  onClick: () => void;
}

function MedicationCard({ name, category, favorite, onClick }: MedicationCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-3 p-4 bg-background hover:bg-accent rounded-lg border border-border hover:border-destructive/50 transition-all text-left"
    >
      <div className="size-10 bg-destructive/10 text-destructive rounded-lg flex items-center justify-center shrink-0">
        <Pill className="size-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="truncate">{name}</h4>
          {favorite && <Star className="size-4 text-amber-500 fill-amber-500" />}
        </div>
        <p className="text-sm text-muted-foreground mb-1">{category}</p>
      </div>
    </button>
  );
}

interface AlgorithmCardProps {
  name: string;
  category: string;
  onClick: () => void;
}

function AlgorithmCard({ name, category, onClick }: AlgorithmCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 bg-background hover:bg-accent rounded-lg border border-border hover:border-destructive/50 transition-all text-left"
    >
      <div className="size-8 bg-destructive/10 text-destructive rounded-lg flex items-center justify-center shrink-0">
        <FileText className="size-4" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm truncate">{name}</h4>
        <p className="text-xs text-muted-foreground">{category}</p>
      </div>
    </button>
  );
}

interface UpdateItemProps {
  title: string;
  date: string;
  type: 'new' | 'update';
}

function UpdateItem({ title, date, type }: UpdateItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
      <div className={`px-2 py-1 rounded text-xs ${
        type === 'new'
          ? 'bg-green-500/10 text-green-700 dark:text-green-400'
          : 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
      }`}>
        {type === 'new' ? 'NEU' : 'UPDATE'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{title}</p>
        <p className="text-xs text-muted-foreground">{date}</p>
      </div>
    </div>
  );
}

const medications = [
  {
    id: '1',
    name: 'Adrenalin',
    category: 'Notfallmedikament',
    favorite: true,
  },
  {
    id: '2',
    name: 'Midazolam',
    category: 'Sedierung',
    favorite: false,
  },
  {
    id: '3',
    name: 'Fentanyl',
    category: 'Analgesie',
    favorite: true,
  },
  {
    id: '4',
    name: 'Amiodaron',
    category: 'Antiarrhythmikum',
  },
];

const algorithms = [
  { id: '1', name: 'Reanimation Erwachsene', category: 'Notfall' },
  { id: '2', name: 'Anaphylaxie', category: 'Allergie' },
  { id: '3', name: 'Akutes Koronarsyndrom', category: 'Kardiologie' },
  { id: '4', name: 'Schlaganfall', category: 'Neurologie' },
  { id: '5', name: 'Kindernotfall', category: 'Pädiatrie' },
];
