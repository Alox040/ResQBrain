import { Container } from "@/components/layout/container";

export function StatusSection() {
  return (
    <section id="status" className="bg-slate-50 py-16 text-slate-900 md:py-24">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold">Projektstatus</h2>
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-5">
          <StatusItem text="Frühe Entwicklungsphase" state="done" />
          <StatusItem text="Architekturphase" state="done" />
          <StatusItem text="Community Feedback Sammlung" state="active" />
          <StatusItem text="Pilotbetrieb" state="pending" />
          <StatusItem text="MVP Release" state="pending" />
        </ol>

        <div className="mx-auto mt-10 max-w-3xl text-center">
          <p className="text-base text-slate-700">
            ResQBrain befindet sich in der frühen Entwicklungsphase.
          </p>
          <p className="mt-2 text-base text-slate-700">
            Die Architektur ist definiert. Jetzt suchen wir Feedback und Pilotpartner aus dem
            Rettungsdienst.
          </p>
          <span className="mt-6 inline-flex rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
            Early Stage — Offen für Feedback
          </span>
        </div>
      </Container>
    </section>
  );
}

function StatusItem({
  text,
  state,
}: {
  text: string;
  state: "done" | "active" | "pending";
}) {
  return (
    <li className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        {state === "done" ? (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path d="M6 12.5 10 16.5 18 8.5" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </span>
        ) : null}
        {state === "active" ? (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white animate-pulse">
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                d="M8 7l8 5-8 5V7Z"
                fill="currentColor"
                stroke="currentColor"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        ) : null}
        {state === "pending" ? (
          <span className="inline-flex h-6 w-6 rounded-full border-2 border-slate-300" />
        ) : null}
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <p className="text-sm font-medium text-slate-800">{text}</p>
    </li>
  );
}
