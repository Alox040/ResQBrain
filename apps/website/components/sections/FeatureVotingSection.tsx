import { Container } from "../layout/Container";

type FeatureCandidate = {
  id: string;
  label: string;
  description?: string;
};

const featureCandidates: FeatureCandidate[] = [
  {
    id: "search-priority",
    label: "Schnellere Suche",
    description: "Welche Suchwege und Trefferlisten im kommunizierten Lookup-Umfang zuerst optimiert werden sollen.",
  },
  {
    id: "medication-detail-depth",
    label: "Mehr Medikament-Details",
    description: "Welche Zusatzinformationen in den Detailansichten wirklich nuetzlich sind.",
  },
  {
    id: "algorithm-navigation",
    label: "Algorithmus-Navigation",
    description: "Wie Schrittfolgen und Sprungmarken in den Detailansichten verbessert werden koennen.",
  },
  {
    id: "favorites-hypothesis",
    label: "Favoriten als Hypothese",
    description: "Moegliche Phase-1-Erweiterung, falls sie im Pilotkontext tatsaechlich Nutzen bringt.",
  },
  {
    id: "calculator-hypothesis",
    label: "Rechenhilfen als Hypothese",
    description: "Moegliche spaetere Erweiterung fuer klar definierte Faelle, nicht Teil des aktuellen kommunizierten Umfangs.",
  },
  {
    id: "learning-hypothesis",
    label: "Lernansichten spaeter",
    description: "Lernfunktionen bleiben ausserhalb des Lookup-Schwerpunkts und werden nur bei echtem Bedarf priorisiert.",
  },
];

export function FeatureVotingSection() {
  return (
    <section id="feature-voting" className="bg-white py-12 text-slate-900 md:py-16">
      <Container>
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm shadow-slate-200/70 md:p-8">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
              Feature Feedback
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              Was soll als naechstes kommen?
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
              Hier sammeln wir Rueckmeldungen zu sinnvollen Verbesserungen des Lookup-Umfangs und zu
              spaeteren Hypothesen fuer die naechste Ausbaustufe.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {featureCandidates.map((feature) => (
              <div
                key={feature.id}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm shadow-slate-200/60"
              >
                <p className="font-semibold tracking-tight text-slate-950">{feature.label}</p>
                {feature.description ? (
                  <p className="mt-1 text-sm leading-6 text-slate-600">{feature.description}</p>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <a
              href="mailto:pilot@resqbrain.de?subject=ResQBrain%20Feature-Feedback"
              className="inline-flex items-center rounded-full border border-slate-900 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-slate-700"
            >
              Feature-Feedback senden
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
