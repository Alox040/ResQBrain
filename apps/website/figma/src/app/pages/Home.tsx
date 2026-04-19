import { 
  ArrowRight, 
  ExternalLink,
  WifiOff, 
  History, 
  Building2,
  CheckCircle2,
  Circle,
  XCircle,
  Stethoscope,
  Clock,
  ShieldAlert,
  ChevronDown,
  Database,
  Lock,
  GitPullRequest
} from "lucide-react";
import { NavLink } from "react-router";
import { useState } from "react";

export function Home() {
  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-300 font-sans selection:bg-zinc-800 selection:text-white pb-32">
      
      {/* 1. HERO */}
      <section className="relative px-4 pt-32 pb-24 sm:pt-48 sm:pb-32 lg:px-8 mx-auto max-w-4xl border-b border-zinc-900/50">
        <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/30 px-3 py-1 text-xs font-medium text-zinc-400 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
          MVP-Phase · Aktive Entwicklung
        </div>
        
        <h1 className="text-4xl font-medium tracking-tight text-zinc-50 sm:text-5xl md:text-6xl mb-6 leading-[1.1]">
          ResQBrain strukturiert medizinisches Einsatzwissen für Rettungsdienstorganisationen.
        </h1>
        
        <p className="text-lg sm:text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed">
          Ein Offline-First Referenzsystem. Algorithmen, Medikamente und SOPs versioniert abrufen – immer exakt im Stand der eigenen Organisation.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <NavLink
            to="/mitwirken"
            className="inline-flex h-12 items-center justify-center rounded bg-zinc-100 px-8 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
          >
            Mitwirken
          </NavLink>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center rounded border border-zinc-800 bg-zinc-950 px-8 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-zinc-50"
          >
            GitHub <ExternalLink className="ml-2 h-4 w-4 text-zinc-500" />
          </a>
        </div>
      </section>

      {/* 2. REALITY BLOCK */}
      <section className="px-4 py-24 sm:py-32 lg:px-8 mx-auto max-w-4xl border-b border-zinc-900/50">
        <h2 className="text-2xl font-medium tracking-tight text-zinc-100 mb-12">Warum bestehende Lösungen nicht reichen</h2>
        
        <div className="space-y-6 mb-12">
          <div className="p-6 rounded border border-zinc-800/60 bg-zinc-900/20">
            <p className="text-lg text-zinc-300 font-medium">"PDF-Protokoll, Seite 23 — im Einsatz nicht aufzufinden."</p>
          </div>
          <div className="p-6 rounded border border-zinc-800/60 bg-zinc-900/20">
            <p className="text-lg text-zinc-300 font-medium">"Neue SOP freigegeben. Team B weiß es noch nicht."</p>
          </div>
          <div className="p-6 rounded border border-zinc-800/60 bg-zinc-900/20">
            <p className="text-lg text-zinc-300 font-medium">"Nachbereitung passiert, wenn jemand Zeit hat."</p>
          </div>
        </div>

        <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl">
          Medizinische Vorgaben entwickeln sich schneller als die Werkzeuge, mit denen sie auf dem Fahrzeug bereitgestellt werden. Das führt zu Unsicherheit und Reibungsverlusten.
        </p>
      </section>

      {/* 3. CORE VALUE */}
      <section className="px-4 py-24 sm:py-32 lg:px-8 mx-auto max-w-4xl border-b border-zinc-900/50">
        <h2 className="text-2xl font-medium tracking-tight text-zinc-100 mb-12">Was ResQBrain bereitstellt</h2>
        
        <div className="grid gap-6 mb-12">
          <div className="flex gap-4 p-6 rounded border border-zinc-800/60 bg-zinc-900/20">
            <WifiOff className="h-6 w-6 text-zinc-500 flex-shrink-0" />
            <div>
              <h3 className="text-base font-medium text-zinc-100 mb-1">Offline-first</h3>
              <p className="text-sm text-zinc-400">Inhalte direkt auf dem Gerät, kein Netz im Einsatz erforderlich.</p>
            </div>
          </div>
          
          <div className="flex gap-4 p-6 rounded border border-zinc-800/60 bg-zinc-900/20">
            <History className="h-6 w-6 text-zinc-500 flex-shrink-0" />
            <div>
              <h3 className="text-base font-medium text-zinc-100 mb-1">Versionierte Inhalte</h3>
              <p className="text-sm text-zinc-400">Jedes Teammitglied sieht verlässlich den exakt selben, freigegebenen Stand.</p>
            </div>
          </div>
          
          <div className="flex gap-4 p-6 rounded border border-zinc-800/60 bg-zinc-900/20">
            <Building2 className="h-6 w-6 text-zinc-500 flex-shrink-0" />
            <div>
              <h3 className="text-base font-medium text-zinc-100 mb-1">Organisationskontext</h3>
              <p className="text-sm text-zinc-400">Inhalte und Anpassungen gehören der eigenen Organisation, nicht der App.</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded border border-orange-900/30 bg-orange-950/10 flex gap-3 items-start">
          <ShieldAlert className="h-5 w-5 text-orange-500/80 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-orange-200/70 leading-relaxed">
            <strong className="text-orange-200/90 font-medium">Systemgrenze:</strong> ResQBrain trifft keine medizinischen Entscheidungen, berechnet keine individuellen Dosierungen und verarbeitet keine Patientendaten. Es strukturiert ausschließlich statische, offiziell freigegebene Inhalte.
          </p>
        </div>
      </section>

      {/* 4. LIVE MVP STATUS */}
      <section className="px-4 py-24 sm:py-32 lg:px-8 mx-auto max-w-4xl border-b border-zinc-900/50">
        <h2 className="text-2xl font-medium tracking-tight text-zinc-100 mb-4">Aktueller Stand</h2>
        <p className="text-sm text-zinc-500 mb-12">Stand April 2026. Aktive Entwicklung. Kein Produktionsrelease.</p>

        <div className="space-y-3 mb-10 bg-zinc-900/20 border border-zinc-800/60 rounded p-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span className="text-sm text-zinc-300">Lookup-Datenmodell (Medikamente, Algorithmen)</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span className="text-sm text-zinc-300">Offline-fähige Mobile App (Prototyp)</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span className="text-sm text-zinc-300">Bundle-System mit Versionsvergleich</span>
          </div>
          
          <div className="my-4 h-px bg-zinc-800/50"></div>
          
          <div className="flex items-center gap-3">
            <Circle className="h-5 w-5 text-amber-500/80" />
            <span className="text-sm text-zinc-400">Approval-Workflow (in Entwicklung)</span>
          </div>
          <div className="flex items-center gap-3">
            <Circle className="h-5 w-5 text-amber-500/80" />
            <span className="text-sm text-zinc-400">Organisationsverwaltung (in Entwicklung)</span>
          </div>
          
          <div className="my-4 h-px bg-zinc-800/50"></div>
          
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-zinc-600" />
            <span className="text-sm text-zinc-500">Produktionsreifer Editor (nicht gestartet)</span>
          </div>
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-zinc-600" />
            <span className="text-sm text-zinc-500">Mehrorganisations-Betrieb (nicht gestartet)</span>
          </div>
        </div>

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          Roadmap auf GitHub einsehen <ArrowRight className="ml-1.5 h-4 w-4" />
        </a>
      </section>

      {/* 5. USE CASES */}
      <section className="px-4 py-24 sm:py-32 lg:px-8 mx-auto max-w-4xl border-b border-zinc-900/50">
        <h2 className="text-2xl font-medium tracking-tight text-zinc-100 mb-12">Für wen und wie</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Use Case A */}
          <div className="flex flex-col h-full border border-zinc-800/60 bg-zinc-900/20 rounded p-6 sm:p-8">
            <div className="h-10 w-10 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center mb-6">
              <Building2 className="h-5 w-5 text-zinc-400" />
            </div>
            <h3 className="text-lg font-medium text-zinc-100 mb-4">Organisation</h3>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-sm text-zinc-400">
                <span className="text-zinc-600 mt-0.5">•</span>
                Ärztlicher Leiter gibt Adrenalin-Dosierungsänderung frei.
              </li>
              <li className="flex gap-3 text-sm text-zinc-400">
                <span className="text-zinc-600 mt-0.5">•</span>
                System verteilt neuen Bundle-Stand an alle Geräte der Organisation.
              </li>
              <li className="flex gap-3 text-sm text-zinc-400">
                <span className="text-zinc-600 mt-0.5">•</span>
                Einsatzkraft sieht beim nächsten App-Start: "Inhalt aktualisiert".
              </li>
            </ul>
            <NavLink to="/mitwirken" className="text-sm font-medium text-emerald-500 hover:text-emerald-400 transition-colors">
              Ist das dein Problem? Mitmachen →
            </NavLink>
          </div>

          {/* Use Case B */}
          <div className="flex flex-col h-full border border-zinc-800/60 bg-zinc-900/20 rounded p-6 sm:p-8">
            <div className="h-10 w-10 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center mb-6">
              <Stethoscope className="h-5 w-5 text-zinc-400" />
            </div>
            <h3 className="text-lg font-medium text-zinc-100 mb-4">Einzeleinsatz</h3>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-sm text-zinc-400">
                <span className="text-zinc-600 mt-0.5">•</span>
                Einsatzkraft sucht offline nach "Anaphylaxie".
              </li>
              <li className="flex gap-3 text-sm text-zinc-400">
                <span className="text-zinc-600 mt-0.5">•</span>
                Findet sofort den freigegebenen Algorithmus der eigenen Organisation.
              </li>
              <li className="flex gap-3 text-sm text-zinc-400">
                <span className="text-zinc-600 mt-0.5">•</span>
                Kein Netz nötig, kein Login während des Einsatzes erforderlich.
              </li>
            </ul>
            <NavLink to="/mitwirken" className="text-sm font-medium text-emerald-500 hover:text-emerald-400 transition-colors">
              Ist das dein Problem? Mitmachen →
            </NavLink>
          </div>
        </div>
      </section>

      {/* 6. MITWIRKUNG (Primärer CTA) */}
      <section className="px-4 py-24 sm:py-32 lg:px-8 mx-auto max-w-4xl border-b border-zinc-900/50">
        <h2 className="text-2xl font-medium tracking-tight text-zinc-100 mb-4">Mach die App besser</h2>
        <p className="text-zinc-400 text-lg leading-relaxed mb-12">
          Praxisrückmeldungen aus dem Rettungsdienst entscheiden über die nächsten Entwicklungsschritte.
        </p>

        <div className="border border-zinc-800/60 bg-zinc-900/20 rounded p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
              <Clock className="h-4 w-4" /> 2 Minuten Aufwand
            </div>
            <h3 className="text-xl font-medium text-zinc-200 mb-2">Umfrage: UI & UX Feedback</h3>
            <p className="text-sm text-zinc-500">Stand April 2026. Teilen Sie Ihre Erfahrungen mit aktuellen SOP-Systemen.</p>
          </div>
          
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <a 
              href="https://forms.office.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-full md:w-auto items-center justify-center rounded bg-emerald-600 px-8 text-sm font-medium text-zinc-50 transition-colors hover:bg-emerald-500 shadow-sm"
            >
              Zur Umfrage <ExternalLink className="ml-2 h-4 w-4" />
            </a>
            <NavLink 
              to="/kontakt"
              className="text-center text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Oder direkt kontaktieren →
            </NavLink>
          </div>
        </div>
      </section>

      {/* 7. TRUST LAYER */}
      <section className="px-4 py-24 sm:py-32 lg:px-8 mx-auto max-w-4xl border-b border-zinc-900/50">
        <h2 className="text-2xl font-medium tracking-tight text-zinc-100 mb-12">Kontext und Einordnung</h2>

        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
          <div className="flex gap-4">
            <Database className="h-5 w-5 text-zinc-500 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-zinc-200 mb-2">Strukturierte Seed-Daten</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Das initiale Datenmodell und die Struktur der Inhalte orientieren sich an gängigen 2026er Richtlinien (z.B. angelehnt an DBRD-Muster), um einen realistischen Startpunkt zu garantieren.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <GitPullRequest className="h-5 w-5 text-zinc-500 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-zinc-200 mb-2">Offenes Entwicklungsmodell</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Transparenz ist Pflicht. Der Quellcode der Plattform ist auf GitHub einsehbar, um Architektur und Sicherheit unabhängig verifizieren zu können.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Building2 className="h-5 w-5 text-zinc-500 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-zinc-200 mb-2">Nicht-kommerziell</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Kein Produkt-Pitch, kein Abo-Modell, kein Vendor Lock-in. ResQBrain ist ein von der Community getriebenes Open-Source Konzept.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Lock className="h-5 w-5 text-zinc-500 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-zinc-200 mb-2">Strikter Datenschutz</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Das System speichert absolut keine Patientendaten, erfasst keine Vitalwerte und trackt keine Nutzerdaten ohne explizite Einwilligung.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="px-4 py-24 sm:py-32 lg:px-8 mx-auto max-w-4xl">
        <h2 className="text-2xl font-medium tracking-tight text-zinc-100 mb-12">Häufige Fragen (FAQ)</h2>

        <div className="space-y-4">
          <FAQItem 
            question="Ersetzt das klinische Entscheidungen?"
            answer="Nein. Dies ist ein striktes Referenz-System. Es berechnet keine Dosen anhand von Patientengewicht und gibt keine KI-gestützten Empfehlungen. Es zeigt lediglich die formell freigegebenen SOPs an."
          />
          <FAQItem 
            question="Funktioniert es ohne Internet?"
            answer="Ja, das ist das Kernversprechen. Nach der einmaligen initialen Synchronisation beim App-Start ist die gesamte Such- und Darstellungslogik 100% offline-fähig."
          />
          <FAQItem 
            question="Wer ist für die Inhalte verantwortlich?"
            answer="Ausschließlich die jeweilige Trägerorganisation bzw. deren Ärztliche Leitung Rettungsdienst (ÄLRD). ResQBrain liefert nur die technische Hülle (den 'Ordner'), nicht das medizinische Protokoll."
          />
          <FAQItem 
            question="Wie komme ich rein / kann ich testen?"
            answer={<>Wir suchen aktuell Organisationen für erste Validierungstests des Backends. Wenn Sie im Qualitätsmanagement oder als ÄLRD tätig sind: <NavLink to="/mitwirken" className="text-emerald-500 hover:text-emerald-400 font-medium">Nutzen Sie den Mitwirken-Bereich</NavLink>.</>}
          />
        </div>
      </section>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-zinc-800/60 rounded bg-zinc-900/10 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-6 text-left focus:outline-none hover:bg-zinc-900/30 transition-colors"
      >
        <span className="text-base font-medium text-zinc-200">{question}</span>
        <ChevronDown className={`h-5 w-5 text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-6 pt-0 mt-2">
          <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}
