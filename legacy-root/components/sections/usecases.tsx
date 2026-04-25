import { Container } from "@/components/layout/container";

export function UseCasesSection() {
  return (
    <section
      id="use-cases"
      className="bg-gradient-to-b from-slate-50 to-white py-16 text-slate-900 md:py-24"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
            Zielgruppen
          </span>
          <h2 className="mt-4 text-3xl font-bold">Für alle, die im Einsatz auf verlässliche Informationen angewiesen sind.</h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <UseCaseCard
            role="RTW- und NEF-Besatzungen"
            benefit="Dosierungen, Algorithmen und lokale Protokolle in Sekunden abrufbar — auch ohne Netz"
          />
          <UseCaseCard
            role="Rettungsdienstorganisationen"
            benefit="Eigene freigegebene Inhalte zentral pflegen und auf alle Geräte übertragen"
          />
          <UseCaseCard
            role="Leitender Notarzt / Ärztliche Leitung"
            benefit="Protokolle versioniert freigeben — nur geprüfte Inhalte erreichen die Einsatzkräfte"
          />
          <UseCaseCard
            role="Disponenten und Einsatzleitung"
            benefit="Einheitlicher Informationsstand auf allen Wachen — kein veraltetes Dokument im Umlauf"
          />
        </div>
      </Container>
    </section>
  );
}

function UseCaseCard({ role, benefit }: { role: string; benefit: string }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 h-1.5 w-12 rounded-full bg-red-600" />
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <circle cx="12" cy="8" r="3.2" fill="currentColor" />
          <path
            d="M5.8 19.2c.8-3 3.4-5 6.2-5s5.4 2 6.2 5"
            stroke="currentColor"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-slate-900">{role}</h3>
      <p className="mt-3 text-base text-slate-600">{benefit}</p>
    </article>
  );
}
