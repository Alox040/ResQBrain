import { Container } from "../layout/Container";

type RoadmapPhase = {
  id: string;
  name: string;
  status: "done" | "upcoming" | "future";
  items: string[];
};

const phases: RoadmapPhase[] = [
  {
    id: "phase-0",
    name: "Phase 0 — Lookup-Schwerpunkt",
    status: "done",
    items: [
      "Algorithm Lookup",
      "Medication Lookup",
      "Statische Datenbasis aus definierter Quelle",
      "Listen- und Detailansichten fuer Medikamente und Algorithmen",
      "Lokaler Zugriff ohne Login und ohne Server-Zwang",
    ],
  },
  {
    id: "phase-1",
    name: "Phase 1 Erweiterungen",
    status: "upcoming",
    items: [
      "Pruefung sinnvoller Erweiterungen auf Basis von Pilot-Feedback",
      "Moegliche Rechenhilfen fuer klar definierte Anwendungsfaelle",
      "Weitere UI-Verbesserungen fuer schnelle Nutzung im Einsatz",
    ],
  },
  {
    id: "phase-2",
    name: "Phase 2 Lernen",
    status: "future",
    items: ["Lernmodus fuer Algorithmen", "Quiz / Selbsttests", "Fallbasiertes Lernen"],
  },
  {
    id: "phase-3",
    name: "Phase 3 Organisation",
    status: "future",
    items: ["Organisationsspezifische Inhalte", "Rollen & Freigabeprozesse", "Content Editor", "Multi-Tenant Isolation"],
  },
];

const statusMeta: Record<
  RoadmapPhase["status"],
  {
    label: string;
    cardClassName: string;
    badgeClassName: string;
    dotClassName: string;
  }
> = {
  done: {
    label: "Abgedeckt",
    cardClassName: "border-emerald-300 bg-emerald-50 shadow-sm shadow-emerald-100/80",
    badgeClassName: "border-emerald-200 bg-white text-emerald-700",
    dotClassName: "bg-emerald-500",
  },
  upcoming: {
    label: "Als Naechstes",
    cardClassName: "border-amber-200 bg-amber-50/60",
    badgeClassName: "border-amber-200 bg-white text-amber-700",
    dotClassName: "bg-amber-500",
  },
  future: {
    label: "Spaeter",
    cardClassName: "border-slate-200 bg-slate-50",
    badgeClassName: "border-slate-200 bg-white text-slate-600",
    dotClassName: "bg-slate-400",
  },
};

export function RoadmapSection() {
  return (
    <section id="roadmap" className="bg-white py-12 text-slate-900 md:py-16">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
              Roadmap
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              Was als Naechstes entsteht
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
              Die Roadmap trennt den heute abgedeckten Lookup-Umfang (Phase 0) klar von spaeteren
              Ausbaustufen. Sie dient zur Orientierung und ersetzt kein verbindliches Angebot.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {phases.map((phase) => {
              const meta = statusMeta[phase.status];

              return (
                <article
                  key={phase.id}
                  className={`rounded-3xl border p-6 transition-colors ${meta.cardClassName}`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex h-3 w-3 flex-none rounded-full ${meta.dotClassName}`}
                          aria-hidden="true"
                        />
                        <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                          {phase.name}
                        </h3>
                      </div>
                    </div>
                    <span
                      className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${meta.badgeClassName}`}
                    >
                      {meta.label}
                    </span>
                  </div>

                  <ul className="mt-5 space-y-3">
                    {phase.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                        <span
                          className="mt-2 inline-flex h-1.5 w-1.5 flex-none rounded-full bg-current"
                          aria-hidden="true"
                        />
                        <span className="leading-6">{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>

          <p className="mt-6 text-sm leading-6 text-slate-500">
            Hinweis: Die Roadmap beschreibt Planung und oeffentlich kommunizierten Stand,
            keine vertraglich zugesicherten Leistungen.
          </p>
        </div>
      </Container>
    </section>
  );
}
