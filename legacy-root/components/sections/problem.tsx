import { Container } from "@/components/layout/container";

export function ProblemSection() {
  return (
    <section id="problem" className="bg-slate-50 py-16 text-slate-900 md:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
            Herausforderung
          </span>
          <h2 className="mt-4 text-3xl font-bold">Im Einsatz zählt jede Sekunde.</h2>
          <p className="mt-3 text-base text-slate-600">
            Die Dosierung. Der nächste Schritt im Algorithmus. Das lokale Protokoll. Wer dafür suchen muss, verliert Zeit.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <article className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <ProblemIcon />
            <p className="text-base text-slate-800">Kein Mobilfunk, kein Zugriff — im Keller oder auf der Autobahn versagen klassische Tools</p>
          </article>
          <article className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <ProblemIcon />
            <p className="text-base text-slate-800">Medikamentendosierungen müssen erst gesucht werden — keine Zeit im Einsatz</p>
          </article>
          <article className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <ProblemIcon />
            <p className="text-base text-slate-800">Algorithmen in PDFs — im Einsatz kaum nutzbar</p>
          </article>
          <article className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <ProblemIcon />
            <p className="text-base text-slate-800">Lokale Protokolle weichen von generischen Leitlinien ab — welche gilt?</p>
          </article>
          <article className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <ProblemIcon />
            <p className="text-base text-slate-800">Informationen auf mehrere Quellen verteilt — kein einheitlicher Stand auf der Wache</p>
          </article>
          <article className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <ProblemIcon />
            <p className="text-base text-slate-800">Einsatzrelevante Inhalte nicht für mobilen Zugriff unter Zeitdruck optimiert</p>
          </article>
        </div>
      </Container>
    </section>
  );
}

function ProblemIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true">
      <path
        d="M12 3.5L2.8 19a1 1 0 0 0 .86 1.5h16.68a1 1 0 0 0 .86-1.5L12 3.5Z"
        fill="currentColor"
        opacity="0.2"
      />
      <path d="M12 8v5.5M12 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
