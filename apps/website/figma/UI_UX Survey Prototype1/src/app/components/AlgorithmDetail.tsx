import { ArrowLeft, AlertCircle, Clock, CheckCircle, ChevronRight } from 'lucide-react';

interface AlgorithmDetailProps {
  onBack: () => void;
}

export function AlgorithmDetail({ onBack }: AlgorithmDetailProps) {
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
          <h1>Reanimation Erwachsene</h1>
          <p className="text-muted-foreground">Notfall-Algorithmus • ALS-Protokoll</p>
        </div>
      </div>

      {/* Alert */}
      <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <h4 className="text-destructive mb-1">Kritische Notfallsituation</h4>
          <p className="text-sm text-destructive/80">
            Sofortiges Handeln erforderlich. Team alarmieren und Protokoll strikt befolgen.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Algorithm Steps */}
        <div className="lg:col-span-2 space-y-4">
          <AlgorithmStep
            number={1}
            title="Kollaps-Erkennung"
            description="Patient bewusstlos, keine normale Atmung"
            critical
          >
            <ul className="space-y-2 text-sm text-muted-foreground mt-3">
              <li>• Ansprechen und Schütteln</li>
              <li>• Atemkontrolle (max. 10 Sek.)</li>
              <li>• Notruf absetzen / Team alarmieren</li>
            </ul>
          </AlgorithmStep>

          <AlgorithmStep
            number={2}
            title="CPR beginnen - 30:2"
            description="Thoraxkompressionen und Beatmung"
            critical
          >
            <div className="mt-3 space-y-3">
              <div className="bg-muted/50 rounded-lg p-3">
                <h4 className="text-sm mb-2">Thoraxkompressionen</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Frequenz: 100-120/min</li>
                  <li>• Tiefe: 5-6 cm</li>
                  <li>• Druckpunkt: Untere Sternumhälfte</li>
                  <li>• Vollständige Entlastung</li>
                </ul>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <h4 className="text-sm mb-2">Beatmung</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 2 Beatmungen nach 30 Kompressionen</li>
                  <li>• Je 1 Sekunde, sichtbare Thoraxhebung</li>
                </ul>
              </div>
            </div>
          </AlgorithmStep>

          <AlgorithmStep
            number={3}
            title="Defibrillator anschließen"
            description="Rhythmusanalyse durchführen"
          >
            <ul className="space-y-2 text-sm text-muted-foreground mt-3">
              <li>• CPR minimieren</li>
              <li>• Elektroden anbringen</li>
              <li>• Rhythmusanalyse</li>
            </ul>
          </AlgorithmStep>

          <AlgorithmStep
            number={4}
            title="Rhythmus-Check"
            description="Schockbar vs. nicht-schockbar"
          >
            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              <div className="bg-destructive/5 border border-destructive/30 rounded-lg p-3">
                <h4 className="text-sm mb-2 text-destructive">Schockbar (VF/pVT)</h4>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>→ 1 Schock</li>
                  <li>→ CPR 2 min</li>
                  <li>→ Adrenalin nach 3. Schock</li>
                  <li>→ Amiodaron nach 3. Schock</li>
                </ul>
              </div>
              <div className="bg-muted/50 border border-border rounded-lg p-3">
                <h4 className="text-sm mb-2">Nicht-schockbar (PEA/Asystolie)</h4>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>→ CPR 2 min</li>
                  <li>→ Adrenalin sofort</li>
                  <li>→ Reversible Ursachen</li>
                </ul>
              </div>
            </div>
          </AlgorithmStep>

          <AlgorithmStep
            number={5}
            title="Medikamente"
            description="Zeitgerechte Applikation"
          >
            <div className="mt-3 space-y-2">
              <MedicationItem
                name="Adrenalin"
                dose="1 mg i.v."
                timing="Alle 3-5 min"
              />
              <MedicationItem
                name="Amiodaron"
                dose="300 mg i.v."
                timing="Nach 3. Schock"
              />
            </div>
          </AlgorithmStep>

          <AlgorithmStep
            number={6}
            title="Reversible Ursachen prüfen"
            description="4 Hs und HITS"
          >
            <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <h4 className="mb-2">4 Hs:</h4>
                <ul className="space-y-1 text-muted-foreground text-xs">
                  <li>• Hypoxie</li>
                  <li>• Hypovolämie</li>
                  <li>• Hypo-/Hyperkaliämie</li>
                  <li>• Hypothermie</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2">HITS:</h4>
                <ul className="space-y-1 text-muted-foreground text-xs">
                  <li>• Herzbeuteltamponade</li>
                  <li>• Intoxikation</li>
                  <li>• Thromboembolie</li>
                  <li>• Spannungspneumothorax</li>
                </ul>
              </div>
            </div>
          </AlgorithmStep>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="size-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-green-600 dark:text-green-400 mb-1">ROSC erreicht</h4>
              <p className="text-sm text-green-600/80 dark:text-green-400/80">
                Post-Reanimationsphase: Überwachung, Temperaturmanagement, Ursachenabklärung
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Reference */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="mb-4">Quick Reference</h3>
            <div className="space-y-3 text-sm">
              <QuickRefItem label="Kompressionsfrequenz" value="100-120/min" />
              <QuickRefItem label="Kompressionstiefe" value="5-6 cm" />
              <QuickRefItem label="Verhältnis" value="30:2" />
              <QuickRefItem label="Schockenergie" value="150-200J (bifasisch)" />
              <QuickRefItem label="Adrenalin" value="1mg alle 3-5 min" />
            </div>
          </div>

          {/* Quality Indicators */}
          <div className="bg-muted/50 border border-border rounded-xl p-6">
            <h4 className="mb-4">Qualitätsindikatoren</h4>
            <div className="space-y-3">
              <QualityIndicator label="Unterbrechungen minimieren" />
              <QualityIndicator label="Vollständige Thoraxentlastung" />
              <QualityIndicator label="Keine Überventilation" />
              <QualityIndicator label="Wechsel alle 2 min" />
              <QualityIndicator label="Kapnographie nutzen" />
            </div>
          </div>

          {/* Version Info */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Clock className="size-4" />
              <span>Version 3.1 • 15.03.2026</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Basiert auf ERC Guidelines 2021
            </p>
          </div>

          {/* Related */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h4 className="mb-3 text-sm">Verwandte Algorithmen</h4>
            <div className="space-y-2">
              <RelatedItem text="Reanimation Kinder" />
              <RelatedItem text="Post-ROSC Care" />
              <RelatedItem text="Bradykardie" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AlgorithmStepProps {
  number: number;
  title: string;
  description: string;
  critical?: boolean;
  children?: React.ReactNode;
}

function AlgorithmStep({ number, title, description, critical, children }: AlgorithmStepProps) {
  return (
    <div className={`bg-card border rounded-xl p-6 ${
      critical ? 'border-destructive/50 bg-destructive/5' : 'border-border'
    }`}>
      <div className="flex items-start gap-4">
        <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${
          critical ? 'bg-destructive text-destructive-foreground' : 'bg-muted text-foreground'
        }`}>
          {number}
        </div>
        <div className="flex-1">
          <h3 className="mb-1">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

interface MedicationItemProps {
  name: string;
  dose: string;
  timing: string;
}

function MedicationItem({ name, dose, timing }: MedicationItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <div>
        <h4 className="text-sm">{name}</h4>
        <p className="text-xs text-muted-foreground">{timing}</p>
      </div>
      <span className="text-sm font-medium">{dose}</span>
    </div>
  );
}

interface QuickRefItemProps {
  label: string;
  value: string;
}

function QuickRefItem({ label, value }: QuickRefItemProps) {
  return (
    <div className="flex justify-between items-start gap-2">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

function QualityIndicator({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <CheckCircle className="size-4 text-green-600 dark:text-green-400" />
      <span>{label}</span>
    </div>
  );
}

function RelatedItem({ text }: { text: string }) {
  return (
    <button className="w-full flex items-center justify-between p-2 hover:bg-accent rounded-lg transition-colors text-sm text-left">
      <span>{text}</span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </button>
  );
}
