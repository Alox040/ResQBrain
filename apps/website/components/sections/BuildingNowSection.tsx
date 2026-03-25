import { Container } from "../layout/Container";

type WorkItem = {
  id: string;
  title: string;
  description: string;
  area: "Backend" | "Datenmodell" | "Mobile" | "Auth" | "Frontend";
  status: "in-progress" | "review";
};

const workItems: WorkItem[] = [
  {
    id: "content-model-versioning",
    title: "Content-Modell & Versionierung",
    description:
      "Wir definieren die Struktur fuer versionierte Inhalte, damit Aenderungen nachvollziehbar bleiben und sauber freigegeben werden koennen.",
    area: "Datenmodell",
    status: "in-progress",
  },
  {
    id: "organization-structure",
    title: "Organisationsstruktur",
    description:
      "Mandanten, Teams und Verantwortlichkeiten werden als belastbares Modell fuer unterschiedliche Organisationsformen aufgebaut.",
    area: "Backend",
    status: "review",
  },
  {
    id: "approval-workflow",
    title: "Approval Workflow",
    description:
      "Der Freigabeprozess fuer Inhalte wird als klarer Ablauf mit Rollen, Statuswechseln und Pruefschritten umgesetzt.",
    area: "Auth",
    status: "in-progress",
  },
  {
    id: "mobile-ui-foundation",
    title: "Mobile UI Grundstruktur",
    description:
      "Die mobile Oberflaeche bekommt ihre erste Navigations- und Screen-Struktur fuer einen schnellen MVP-Ausbau.",
    area: "Mobile",
    status: "in-progress",
  },
];

const areaClasses: Record<WorkItem["area"], string> = {
  Backend: "border-sky-200 bg-sky-50 text-sky-700",
  Datenmodell: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Mobile: "border-orange-200 bg-orange-50 text-orange-700",
  Auth: "border-rose-200 bg-rose-50 text-rose-700",
  Frontend: "border-violet-200 bg-violet-50 text-violet-700",
};

const statusMeta: Record<WorkItem["status"], { label: string; className: string }> = {
  "in-progress": {
    label: "In Arbeit",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  review: {
    label: "Im Review",
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
              Was wir gerade bauen
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
              Vier konkrete Bausteine, die aktuell die Grundlage fuer den ersten
              einsatzfaehigen ResQBrain-Workflow bilden.
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
