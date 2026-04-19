import { ArrowLeft, Star, AlertCircle, Info, Clock } from 'lucide-react';
import { useState } from 'react';

interface MedicationDetailProps {
  onBack: () => void;
}

export function MedicationDetail({ onBack }: MedicationDetailProps) {
  const [isFavorite, setIsFavorite] = useState(true);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="flex-1">
          <h1>Adrenalin</h1>
          <p className="text-muted-foreground">Notfallmedikament • Sympathomimetikum</p>
        </div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`p-2 rounded-lg transition-colors ${
            isFavorite ? 'text-amber-500' : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <Star className={`size-6 ${isFavorite ? 'fill-amber-500' : ''}`} />
        </button>
      </div>

      {/* Alert Box */}
      <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <h4 className="text-destructive mb-1">Hochpotentes Notfallmedikament</h4>
          <p className="text-sm text-destructive/80">
            Nur unter ärztlicher Aufsicht oder nach spezifischer Ausbildung anwenden.
            Korrekte Dosierung beachten!
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Indikation */}
          <Section title="Indikation">
            <ul className="space-y-2 text-muted-foreground">
              <li>• Herz-Kreislauf-Stillstand (Reanimation)</li>
              <li>• Anaphylaktischer Schock</li>
              <li>• Schwere allergische Reaktion</li>
              <li>• Bradykardie mit hämodynamischer Instabilität</li>
            </ul>
          </Section>

          {/* Dosierung */}
          <Section title="Dosierung">
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="mb-2">Erwachsene (Reanimation)</h4>
                <p className="text-muted-foreground mb-2">
                  <strong>1 mg i.v.</strong> alle 3-5 Minuten
                </p>
                <p className="text-sm text-muted-foreground">
                  Entspricht 1 ml der 1:1000 Lösung (1 mg/ml)
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="mb-2">Kinder</h4>
                <p className="text-muted-foreground mb-2">
                  <strong>0.01 mg/kg i.v.</strong> (max. 1 mg)
                </p>
                <p className="text-sm text-muted-foreground">
                  Bei Kindern gewichtsadaptiert dosieren
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="mb-2">Anaphylaxie</h4>
                <p className="text-muted-foreground mb-2">
                  <strong>0.3-0.5 mg i.m.</strong> (Oberschenkel)
                </p>
                <p className="text-sm text-muted-foreground">
                  Kann nach 5-15 min wiederholt werden
                </p>
              </div>
            </div>
          </Section>

          {/* Kontraindikation */}
          <Section title="Kontraindikation">
            <ul className="space-y-2 text-muted-foreground">
              <li>• Keine absoluten KI in lebensbedrohlichen Situationen</li>
              <li>• Relative KI: Schwere Hypertonie, Tachykardie</li>
              <li>• Vorsicht bei bekannter KHK</li>
            </ul>
          </Section>

          {/* Nebenwirkungen */}
          <Section title="Nebenwirkungen">
            <div className="grid sm:grid-cols-2 gap-3">
              <NebenwirkungItem text="Tachykardie" />
              <NebenwirkungItem text="Hypertonie" />
              <NebenwirkungItem text="Arrhythmien" />
              <NebenwirkungItem text="Kopfschmerzen" />
              <NebenwirkungItem text="Tremor" />
              <NebenwirkungItem text="Übelkeit" />
            </div>
          </Section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Dosierung: statischer Referenzblock, keine Eingaben oder Berechnung */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="mb-2">Dosierung</h3>
            <p className="text-sm text-muted-foreground">
              Referenzinhalt nur als statischer Freitext aus freigegebener Quelle.
            </p>
            <div className="text-xs text-muted-foreground flex items-start gap-2 mt-4">
              <Info className="size-4 shrink-0 mt-0.5" />
              <p>Keine patientenbezogene Berechnung in dieser Ansicht.</p>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-muted/50 border border-border rounded-xl p-6">
            <h4 className="mb-4">Schnellinfo</h4>
            <div className="space-y-3 text-sm">
              <InfoRow label="Handelsname" value="Suprarenin®" />
              <InfoRow label="Wirkstoffklasse" value="Sympathomimetikum" />
              <InfoRow label="Wirkeintritt" value="1-2 min (i.v.)" />
              <InfoRow label="Wirkdauer" value="5-10 min" />
              <InfoRow label="Lagerung" value="Vor Licht schützen" />
            </div>
          </div>

          {/* Version Info */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4" />
              <span>Zuletzt aktualisiert: 02.04.2026</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Version 2.3 • Freigegeben von Dr. Müller
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="mb-4">{title}</h3>
      {children}
    </div>
  );
}

function NebenwirkungItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="size-1.5 bg-destructive rounded-full"></div>
      <span>{text}</span>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex justify-between items-start gap-2">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
