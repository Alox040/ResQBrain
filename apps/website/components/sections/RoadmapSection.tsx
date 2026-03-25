import { Container } from "../layout/Container";

type RoadmapPhase = {
  id: string;
  name: string;
  status: "current" | "upcoming" | "future";
  items: string[];
};

const phases: RoadmapPhase[] = [
  {
    id: "phase-1",
    name: "Phase 1 Fundament",
    status: "current",
    items: ["Architektur", "Domain Modell", "Content Modell"],
  },
  {
    id: "phase-2",
    name: "Phase 2 MVP",
    status: "upcoming",
    items: [
      "Organisationsverwaltung",
      "Content CRUD",
      "Approval Workflow",
      "Mobile Ansicht",
    ],
  },
  {
    id: "phase-3",
    name: "Phase 3 Pilot",
    status: "future",
    items: ["Pilotorganisationen", "Feedback Integration", "Offline Sync"],
  },
  {
    id: "phase-4",
    name: "Phase 4 Ausbau",
    status: "future",
    items: ["Feature Voting", "weitere Inhaltstypen", "Leitstellenintegration"],
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
  current: {
    label: "Aktuell",
    cardClassName: "border-red-300 bg-red-50 shadow-sm shadow-red-100/80",
    badgeClassName: "border-red-200 bg-white text-red-700",
    dotClassName: "bg-red-500",
  },
  upcoming: {
    label: "Als Nächstes",
    cardClassName: "border-amber-200 bg-amber-50/60",
    badgeClassName: "border-amber-200 bg-white text-amber-700",
    dotClassName: "bg-amber-500",
  },
  future: {
    label: "Später",
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
              Was als Nächstes entsteht
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
              Die Roadmap zeigt die aktuelle Reihenfolge der Arbeitspakete. Sie dient
              als Orientierung und wird mit neuen Erkenntnissen laufend geschärft.
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
            Hinweis: Die Inhalte dieser Roadmap beschreiben den aktuellen Arbeitsstand,
            nicht einen verbindlichen Leistungsumfang.
          </p>
        </div>
      </Container>
    </section>
  );
}
