import status from "@/content/status.json";

import { Container } from "../layout/Container";

export function StatusSection() {
  return (
    <section id="status" className="bg-white py-12 text-slate-900 md:py-16">
      <Container>
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm shadow-slate-200/70 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
                {status.projectPhase.label}
              </span>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                {status.projectPhase.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
                {status.projectPhase.summary}
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-500 md:justify-end">
              <span>Stand: {status.projectPhase.asOf}</span>
              <a
                href="#roadmap"
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600 transition-colors duration-200 hover:border-slate-300 hover:text-slate-900"
              >
                Zur Roadmap
              </a>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <article className="rounded-3xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                Current Focus
              </p>
              <ul className="mt-4 space-y-3">
                {status.currentFocus.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                Next Steps
              </p>
              <ol className="mt-4 space-y-3">
                {status.nextSteps.map((item, index) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                    <span className="inline-flex min-w-6 justify-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-5 lg:col-span-2">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                Roadmap
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {status.roadmap.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </Container>
    </section>
  );
}
