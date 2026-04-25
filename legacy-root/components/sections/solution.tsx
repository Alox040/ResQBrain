import { Container } from "@/components/layout/container";

export function SolutionSection() {
  return (
    <section id="loesung" className="bg-slate-900 py-16 text-slate-100 md:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-red-600/20 px-3 py-1 text-sm font-medium text-red-200">
            Unsere Antwort
          </span>
          <h2 className="mt-4 text-3xl font-bold">Kein Suchen. Kein Scrollen.</h2>
          <p className="mt-3 text-base text-slate-300">
            ResQBrain gibt Einsatzkräften direkten Zugriff auf Medikamente, Algorithmen und
            Protokolle — offline verfügbar, auf die Wache abgestimmt, in Sekunden abrufbar.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <SolutionItem text="Medikamente mit Dosierung und Kontraindikationen" />
          <SolutionItem text="Algorithmen als Schritt-für-Schritt-Ansicht" />
          <SolutionItem text="Einsatzmodus — optimiert für Zeitdruck und Handschuhe" />
          <SolutionItem text="Nur freigegebene Inhalte eurer Wache" />
          <SolutionItem text="Suche in unter drei Sekunden" />
          <SolutionItem text="Offline — voller Zugriff ohne Netz" planned />
        </div>
      </Container>
    </section>
  );
}

function SolutionItem({ text, planned = false }: { text: string; planned?: boolean }) {
  return (
    <article className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/70 p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-400" aria-hidden="true">
          <path d="M5 12.5 9.2 17 19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-base text-slate-100">{text}</p>
      </div>
      {planned ? (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
          Geplant
        </span>
      ) : null}
    </article>
  );
}
