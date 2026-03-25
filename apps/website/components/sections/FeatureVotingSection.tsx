import { Container } from "../layout/Container";

type FeatureCandidate = {
  id: string;
  label: string;
  description?: string;
};

const featureCandidates: FeatureCandidate[] = [
  {
    id: "offline-algorithms",
    label: "Offline Algorithmen",
    description: "Entscheidungspfade lokal verfuegbar, auch ohne stabile Verbindung.",
  },
  {
    id: "dosage-calculator",
    label: "Dosierungsrechner",
    description: "Schnelle Berechnung fuer typische Einsatz- und Notfallkontexte.",
  },
  {
    id: "dispatch-integration",
    label: "Leitstellen Anbindung",
    description: "Relevante Einsatzdaten strukturiert aus bestehenden Systemen uebernehmen.",
  },
  {
    id: "training-mode",
    label: "Ausbildungsmodus",
    description: "Szenarien und Lernpfade fuer Training, Einweisung und Wiederholung.",
  },
  {
    id: "report-export",
    label: "Einsatzprotokoll Export",
    description: "Inhalte und Entscheidungen nachvollziehbar fuer Dokumentation ausgeben.",
  },
  {
    id: "sop-update-push",
    label: "SOP Update Push",
    description: "Aenderungen an SOPs gezielt und sichtbar an Teams verteilen.",
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
              Was soll als nächstes kommen?
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
              Wir sammeln Feedback welche Funktionen im Rettungsdienst Alltag am
              wichtigsten sind.
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
              href="#cta"
              className="inline-flex items-center rounded-full border border-slate-900 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-slate-700"
            >
              Feedback geben
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
