import { Container } from "@/components/layout/container";

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
    title: "Bedarfserhebung: Digitale Einsatzdokumentation",
    description:
      "Welche Informationen muessen Rettungskraefte im Einsatz am schnellsten erfassen, finden und weitergeben koennen?",
    status: "active",
    startDate: "2026-03-01",
    endDate: "2026-04-12",
    participants: 42,
    highlights: [
      "Fokus auf Alarmierung, Dokumentation und Uebergabe",
      "Rueckmeldungen aus Stadt- und Landkreisen",
      "Auswertung fliesst direkt in den MVP-Backlog ein",
    ],
    surveyUrl: "https://forms.cloud.microsoft/r/ZFVgC0L1BZ",
  },
  {
    id: "survey-002",
    title: "Priorisierung: Offline-Funktionen im Einsatz",
    description:
      "Welche Inhalte muessen auch ohne Netzabdeckung jederzeit verfuegbar bleiben, damit die Plattform im Alltag belastbar ist?",
    status: "analyzing",
    startDate: "2026-01-15",
    endDate: "2026-02-28",
    participants: 118,
    highlights: [
      "Offline-Algorithmen wurden am haeufigsten genannt",
      "Medikamentenlisten haben hoechste Prioritaet",
      "Synchronisation nach Netzrueckkehr ist zentral",
    ],
  },
  {
    id: "survey-003",
    title: "Nutzerbefragung: Prototyp-Feedback",
    description:
      "Erste Rueckmeldungen zur Navigationsstruktur, Lesbarkeit und Bedienung des Prototyps unter Einsatzbedingungen.",
    status: "completed",
    startDate: "2025-11-01",
    endDate: "2025-12-15",
    participants: 67,
    highlights: [
      "Kontrast und Schriftgroesse wurden als kritisch bewertet",
      "Einhand-Bedienung wurde stark nachgefragt",
      "Suche und Schnellzugriff waren die wichtigsten Features",
    ],
    resultsUrl:
      "https://drive.google.com/file/d/1uKMuiNduTUMstE_5W3EmHEzpnGnL5n6_/view?usp=sharing",
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
  const actionLabel = isActive
    ? "Zur Umfrage"
    : isCompleted
      ? "Ergebnisse"
      : "Auswertung läuft";
  const actionHref = isActive ? survey.surveyUrl : isCompleted ? survey.resultsUrl : undefined;

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

      <div className="mt-6 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Zeitraum
          </p>
          <p className="mt-1">{dateLabel ?? "Noch offen"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Teilnahme
          </p>
          <p className="mt-1">
            {survey.participants !== undefined ? `${survey.participants} Personen` : "Noch keine Daten"}
          </p>
        </div>
      </div>

      <div className="mt-auto pt-6">
        {actionHref ? (
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
      id="surveys"
      className="bg-gradient-to-b from-slate-50 via-white to-slate-100 py-16 text-slate-900 md:py-24"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
            Community Feedback
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Umfragen und Ergebnisse
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            ResQBrain wird gemeinsam mit Rettungskraeften entwickelt. Aktive Umfragen stehen oben,
            abgeschlossene Runden und laufende Auswertungen darunter.
          </p>
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
              Aktive Umfragen
            </h3>
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
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-300">
                Naechste Feedbackrunde
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                Hilf mit, die naechsten Prioritaeten fuer ResQBrain festzulegen.
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Wir suchen Rueckmeldungen aus dem Rettungsdienst, aus Leitstellen und aus der
                Ausbildung. Jede Teilnahme verbessert die Produktentscheidungen.
              </p>
            </div>

            <a
              href="#feedback"
              className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700"
            >
              Zur naechsten Umfrage
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
