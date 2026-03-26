import { Container } from "@/components/layout/container";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.22),transparent_48%)]" />
      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-50 md:text-6xl">ResQBrain</h1>
          <p className="mt-5 text-lg text-slate-300 md:text-xl">
            Medikamente. Algorithmen. Sofort griffbereit — auch offline.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full border border-red-500/30 bg-red-600/10 px-3 py-1 text-sm font-medium text-red-200">
              Medikamente & Dosierungen
            </span>
            <span className="rounded-full border border-red-500/30 bg-red-600/10 px-3 py-1 text-sm font-medium text-red-200">
              Algorithmen
            </span>
            <span className="rounded-full border border-red-500/30 bg-red-600/10 px-3 py-1 text-sm font-medium text-red-200">
              Offline
            </span>
          </div>

          <ul className="mt-8 space-y-2 text-base text-slate-200">
            <li>Offline verfügbar — auch ohne Mobilfunk</li>
            <li>Dosierungen und Kontraindikationen auf einen Blick</li>
            <li>Freigegebene Protokolle eurer Wache</li>
          </ul>

          <p className="mx-auto mt-8 inline-flex rounded-full border border-yellow-500/30 bg-yellow-400/10 px-4 py-2 text-sm font-medium text-yellow-100">
            Frühe Entwicklungsphase — Community-Feedback aktiv
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#feedback"
              className="inline-flex w-full items-center justify-center rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700 sm:w-auto"
            >
              Feedback geben
            </a>
            <a
              href="#cta"
              className="inline-flex w-full items-center justify-center rounded-lg border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors duration-200 hover:bg-slate-800 sm:w-auto"
            >
              Pilotpartner werden
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
