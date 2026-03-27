import { Container } from "../layout/Container";

type WorkItem = {
  id: string;
  title: string;
  description: string;
  area: "Lookup" | "Datenbasis" | "Vorbereitung";
  status: "done" | "planned";
};

const workItems: WorkItem[] = [
  {
    id: "algorithm-lookup",
    title: "Algorithm Lookup",
    description:
      "Algorithmen sind als Lookup-Baustein in Listen- und Detailansichten im kommunizierten Umfang abgebildet.",
    area: "Lookup",
    status: "done",
  },
  {
    id: "medication-lookup",
    title: "Medication Lookup",
    description:
      "Medikamenteninformationen stehen in einer statischen Datenbasis lokal fuer Listen- und Detailansichten bereit.",
    area: "Lookup",
    status: "done",
  },
  {
    id: "static-data",
    title: "Statische Datenbasis",
    description:
      "Gepruefte Inhalte werden fuer einen Pilotkontext aus einer definierten Quelle gebuendelt und lokal bereitgestellt.",
    area: "Datenbasis",
    status: "done",
  },
  {
    id: "phase-1-prep",
    title: "Naechste Ausbaustufe",
    description:
      "Weitere Themen werden aus Pilot-Feedback eingegrenzt und noch nicht als fertige Produktfunktionen bezeichnet.",
    area: "Vorbereitung",
    status: "planned",
  },
];

const areaClasses: Record<WorkItem["area"], string> = {
  Lookup: "border-sky-200 bg-sky-50 text-sky-700",
  Datenbasis: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Vorbereitung: "border-violet-200 bg-violet-50 text-violet-700",
};

const statusMeta: Record<WorkItem["status"], { label: string; className: string }> = {
  done: {
    label: "Abgedeckt",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  planned: {
    label: "Geplant",
    className: "border-slate-200 bg-slate-100 text-slate-700",
  },
};

export function BuildingNowSection() {
  return (
    <section id="building-now" className="bg-white py-12 text-slate-900 md:py-16">
      <Container>
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
              Produktentwicklung
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              Was heute bereits steht
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
              Der oeffentlich kommunizierte Umfang entspricht dem Lookup-Schwerpunkt der Roadmap
              (Phase 0). Hier steht, was in diesem Stand umgesetzt ist und was fuer die naechste
              Ausbaustufe vorbereitet wird — ohne darueber hinausgehende Funktionen zu behaupten.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {workItems.map((item) => {
              const status = statusMeta[item.status];

              return (
                <article
                  key={item.id}
                  className="flex h-full flex-col rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm shadow-slate-200/70"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${areaClasses[item.area]}`}
                    >
                      {item.area}
                    </span>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
