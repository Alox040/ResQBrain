import Link from "next/link";

import { Container } from "../layout/Container";

export type SurveyStatus = "active" | "analyzing" | "completed";

export type Survey = {
  id: string;
  title: string;
  description: string;
  status: SurveyStatus;
  startDate?: string;
  endDate?: string;
  participants?: number;
  highlights?: string[];
  surveyUrl?: string;
  resultsUrl?: string;
};

const SURVEYS: Survey[] = [
  {
    id: "survey-001",
    title: "Bedarfserhebung: Lookup im Einsatz",
    description:
      "Welche Medikamente und Algorithmen sollen im Einsatz besonders schnell auffindbar sein?",
    status: "active",
    startDate: "2026-03-01",
    endDate: "2026-04-12",
    highlights: [
      "Es geht um Suchwege, Prioritaeten und Lesbarkeit.",
      "Rueckmeldungen aus dem operativen Kontext.",
      "Dient der Priorisierung; keine automatisierten Produktfolgen.",
    ],
    surveyUrl: "mailto:pilot@resqbrain.de?subject=ResQBrain%20Umfrage%20Lookup%20im%20Einsatz",
  },
  {
    id: "survey-002",
    title: "Priorisierung: Offline-Funktionen im Einsatz",
    description:
      "Welche Inhalte sollen in einem fruehen Ausbau auch ohne Netzabdeckung lokal verfuegbar bleiben?",
    status: "analyzing",
    startDate: "2026-01-15",
    endDate: "2026-02-28",
    highlights: [
      "Die Auswertung ist noch nicht abgeschlossen.",
      "Ergebnisse werden zusammengefasst, sobald die Runde final bewertet ist.",
    ],
  },
  {
    id: "survey-003",
    title: "Nutzerbefragung: Prototyp-Feedback",
    description:
      "Rueckmeldungen zur Navigationsstruktur, Lesbarkeit und Bedienung eines fruehen Prototyps.",
    status: "completed",
    startDate: "2025-11-01",
    endDate: "2025-12-15",
    highlights: [
      "Die Befragung ist abgeschlossen.",
      "Details koennen auf Anfrage im Pilotkontext besprochen werden.",
    ],
    resultsUrl: "mailto:pilot@resqbrain.de?subject=ResQBrain%20Ergebnisse%20Prototyp-Feedback",
  },
];

const statusConfig: Record<
  SurveyStatus,
  {
    label: string;
    className: string;
  }
> = {
  active: {
    label: "Aktiv",
    className: "border border-green-200 bg-green-50 text-green-700",
  },
  analyzing: {
    label: "Auswertung laeuft",
    className: "border border-amber-200 bg-amber-50 text-amber-700",
  },
  completed: {
    label: "Abgeschlossen",
    className: "border border-slate-200 bg-slate-100 text-slate-600",
  },
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function formatDateRange(startDate?: string, endDate?: string) {
  if (!startDate) return null;
  const start = formatDate(startDate);

  if (!endDate) {
    return `Seit ${start}`;
  }

  return `${start} - ${formatDate(endDate)}`;
}

export function SurveyStatusBadge({ status }: { status: SurveyStatus }) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export function SurveyCard({ survey }: { survey: Survey }) {
  const dateLabel = formatDateRange(survey.startDate, survey.endDate);
  const isActive = survey.status === "active";
  const isCompleted = survey.status === "completed";
  const actionHref = isActive ? survey.surveyUrl : isCompleted ? survey.resultsUrl : undefined;
  const actionLabel = isActive
    ? actionHref?.startsWith("mailto:")
      ? "Per E-Mail teilnehmen"
      : "Zur Umfrage"
    : isCompleted
      ? actionHref?.startsWith("mailto:")
        ? "Ergebnisse per E-Mail anfragen"
        : "Ergebnisse anfragen"
      : "Auswertung laeuft";

  return (
    <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 transition-transform duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <SurveyStatusBadge status={survey.status} />
          <h3 className="text-xl font-semibold tracking-tight text-slate-950">{survey.title}</h3>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">{survey.description}</p>

      {survey.highlights && survey.highlights.length > 0 ? (
        <ul className="mt-5 space-y-2">
          {survey.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-3 text-sm text-slate-700">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden="true" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div
        className={`mt-6 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 ${
          survey.participants !== undefined ? "sm:grid-cols-2" : ""
        }`}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Zeitraum</p>
          <p className="mt-1">{dateLabel ?? "Noch offen"}</p>
        </div>
        {survey.participants !== undefined ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Teilnahme
            </p>
            <p className="mt-1">{survey.participants} Personen</p>
          </div>
        ) : null}
      </div>

      <div className="mt-auto pt-6">
        {actionHref ? (
          <>
            <a
              href={actionHref}
              className={`inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-200 sm:w-auto ${
                isActive
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {actionLabel}
            </a>
            {isActive ? (
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                Die Umfrage wird ueber einen externen Anbieter oder direkten Kontakt organisiert.
                <br />
                Es gilt zusaetzlich deren Datenschutz.{" "}
                <Link
                  href="/datenschutz"
                  className="font-semibold text-red-700 underline decoration-red-700/40 underline-offset-2 hover:text-red-800"
                >
                  Datenschutz
                </Link>
              </p>
            ) : null}
          </>
        ) : (
          <span className="inline-flex w-full items-center justify-center rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 sm:w-auto">
            {actionLabel}
          </span>
        )}
      </div>
    </article>
  );
}

export function SurveysSection({ surveys = SURVEYS }: { surveys?: Survey[] }) {
  const activeSurveys = surveys.filter((survey) => survey.status === "active");
  const completedSurveys = surveys.filter((survey) => survey.status !== "active");

  return (
    <section
      id="feedback"
      className="bg-gradient-to-b from-slate-50 via-white to-slate-100 py-16 text-slate-900 md:py-24"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
            Feedback
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Umfragen und Ergebnisse</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Rueckmeldungen werden per Umfrage oder direktem Kontakt gesammelt. Aktive Runden stehen oben;
            abgeschlossene Umfragen und laufende Auswertungen darunter.
          </p>
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-2xl font-semibold tracking-tight text-slate-950">Aktive Umfragen</h3>
            <span className="text-sm text-slate-500">{activeSurveys.length} offen</span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {activeSurveys.map((survey) => (
              <SurveyCard key={survey.id} survey={survey} />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
              Abgeschlossene Umfragen
            </h3>
            <span className="text-sm text-slate-500">{completedSurveys.length} Eintraege</span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {completedSurveys.map((survey) => (
              <SurveyCard key={survey.id} survey={survey} />
            ))}
          </div>
        </div>

        <div className="mt-16 rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-8 text-slate-100 shadow-xl shadow-slate-900/10 md:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-300">Mitmachen</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                Hilf mit, die naechsten Prioritaeten fuer ResQBrain festzulegen.
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Gesucht sind Rueckmeldungen aus dem operativen Rettungsdienst, damit der naechste Ausbau
                am realen Bedarf ausgerichtet bleibt.
              </p>
            </div>

            <div className="flex w-full flex-col items-stretch md:w-auto md:items-end">
              <a
                href="mailto:pilot@resqbrain.de?subject=ResQBrain%20Naechste%20Feedbackrunde"
                className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700"
              >
                Feedbackrunde anfragen
              </a>
              <p className="mt-3 max-w-md text-left text-xs leading-relaxed text-slate-400 md:text-right">
                Rueckmeldungen koennen ueber externe Umfragen oder direkten Kontakt eingehen.
                <br />
                Es gilt zusaetzlich deren Datenschutz.{" "}
                <Link
                  href="/datenschutz"
                  className="font-semibold text-red-300 underline decoration-red-300/40 underline-offset-2 hover:text-red-200"
                >
                  Datenschutz
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
