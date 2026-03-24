import { Container } from "@/components/layout/container";

export function CtaSection() {
  return (
    <section
      id="cta"
      className="bg-gradient-to-b from-slate-900 to-slate-950 py-16 text-slate-100 md:py-24"
    >
      <Container>
        <div id="feedback" className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold">Mach mit</h2>
          <p className="mt-3 text-base text-slate-300">
            ResQBrain wird gemeinsam mit der Community entwickelt.
          </p>
          <p className="mt-1 text-base text-slate-300">Dein Feedback formt das Produkt.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <CtaCard
            title="Feedback geben"
            description="Teile deine Erfahrungen aus dem Rettungsdienst"
            buttonLabel="Feedback geben"
            href="#"
            strong
          />
          <CtaCard
            title="Idee einreichen"
            description="Schlage Features oder Verbesserungen vor"
            buttonLabel="Idee einreichen"
            href="#"
          />
          <CtaCard
            title="Pilotpartner werden"
            description="Teste ResQBrain in deiner Organisation"
            buttonLabel="Pilotpartner werden"
            href="#"
            strong
          />
          <CtaCard
            title="Projekt folgen"
            description="Bleib über Fortschritte informiert"
            buttonLabel="Folgen"
            href="#"
          />
          <CtaCard
            title="Community beitreten"
            description="Diskutiere mit anderen im Rettungsdienst"
            buttonLabel="Community beitreten"
            href="#"
          />
        </div>
      </Container>
    </section>
  );
}

function CtaCard({
  title,
  description,
  buttonLabel,
  href,
  strong = false,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
  strong?: boolean;
}) {
  return (
    <article
      className={`rounded-xl border p-6 shadow-sm ${
        strong
          ? "border-red-500/40 bg-slate-900 ring-1 ring-red-500/30"
          : "border-slate-700 bg-slate-900/70"
      }`}
    >
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-red-300">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
      <p className="mt-2 text-base text-slate-300">{description}</p>
      <a
        href={href}
        className={`mt-6 inline-flex items-center rounded-lg px-6 py-3 text-sm font-semibold transition-colors duration-200 ${
          strong
            ? "bg-red-600 text-white hover:bg-red-700"
            : "border border-slate-600 text-slate-200 hover:bg-slate-800"
        }`}
      >
        {buttonLabel}
      </a>
    </article>
  );
}
