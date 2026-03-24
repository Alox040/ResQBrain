import { Container } from "@/components/layout/container";

export function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-16 text-slate-900 md:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
            Was ResQBrain kann
          </span>
          <h2 className="mt-4 text-3xl font-bold">Features</h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard title="Versionierte Algorithmen" status="Verfügbar" />
          <FeatureCard title="Medikamentenlisten" status="Verfügbar" />
          <FeatureCard title="SOP Verwaltung" status="Verfügbar" />
          <FeatureCard title="Mehrere Organisationen" status="Verfügbar" />
          <FeatureCard title="Offline Zugriff" status="Geplant" />
          <FeatureCard title="KI Suche" status="Geplant" />
        </div>
      </Container>
    </section>
  );
}

function FeatureCard({ title, status }: { title: string; status: "Verfügbar" | "Geplant" }) {
  const available = status === "Verfügbar";
  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <div className="mt-auto pt-6">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
            available ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
          }`}
        >
          {status}
        </span>
      </div>
    </article>
  );
}
