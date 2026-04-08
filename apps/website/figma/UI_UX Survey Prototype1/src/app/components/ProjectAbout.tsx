function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="pt-2 border-t border-[#17233f] flex flex-col gap-1.5">
      <span className="text-[10px] text-[#4f7db3] uppercase tracking-widest">{number}</span>
      <h2 className="text-sm font-medium text-zinc-300">{title}</h2>
    </div>
  );
}

export function ProjectAbout() {
  return (
    <section id="about" className="flex flex-col gap-24 md:gap-32 w-full">

      {/* 01 — Was dieses Projekt ist */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
        <div className="md:col-span-4 lg:col-span-3">
          <div className="sticky top-24">
            <SectionLabel number="01" title="Was dieses Projekt ist" />
          </div>
        </div>
        <div className="md:col-span-8 lg:col-span-7 flex flex-col gap-5 text-sm text-zinc-400 leading-relaxed font-light">
          <p>
            ResQBrain ist der Entwurf eines digitalen Nachschlagewerks für den Rettungsdienst. Es soll ein Ort sein, an dem Einsatzkräfte schnell und zuverlässig nachschlagen können, wie bei einem bestimmten Krankheitsbild vorzugehen ist — auch wenn kein Netz verfügbar ist.
          </p>
          <p>
            Das Projekt befindet sich noch ganz am Anfang. Es gibt bisher einen ersten Prototypen für die Oberfläche, aber noch keine fertige Anwendung. Die Idee dahinter wird auf dieser Seite beschrieben.
          </p>
        </div>
      </div>

      {/* 02 — Warum es das gibt */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
        <div className="md:col-span-4 lg:col-span-3">
          <div className="sticky top-24">
            <SectionLabel number="02" title="Warum es das gibt" />
          </div>
        </div>
        <div className="md:col-span-8 lg:col-span-7 flex flex-col gap-5 text-sm text-zinc-400 leading-relaxed font-light">
          <p>
            Im Rettungsdienst arbeiten Menschen unter erheblichem Druck. Gleichzeitig gibt es in jedem Bundesland, manchmal sogar in jedem Landkreis, eigene Vorgaben: andere Medikamente, andere Dosierungen, andere Vorgehensweisen.
          </p>
          <p>
            Diese Informationen landen heute meist in ausgedruckten Heften, PDF-Dateien oder schlecht gepflegten Intranet-Seiten. Wer im Einsatz etwas nachschlagen muss, verliert wertvolle Zeit.
          </p>
          <p>
            ResQBrain entstand aus dem Wunsch, das besser zu machen — nicht als großes Softwareprojekt, sondern als praktische Hilfe aus der Praxis für die Praxis.
          </p>
        </div>
      </div>

      {/* 03 — Womit es helfen soll */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start bg-[#0c1427]/60 border border-[#17233f] p-8 md:p-12 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#12b5ab]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="md:col-span-4 lg:col-span-3 relative z-10">
          <div className="sticky top-24">
            <SectionLabel number="03" title="Womit es helfen soll" />
          </div>
        </div>
        <div className="md:col-span-8 lg:col-span-7 flex flex-col gap-5 text-sm text-zinc-400 leading-relaxed font-light relative z-10">
          <p>
            Das Ziel ist eine Anwendung, die auf jedem Smartphone funktioniert — auch ohne Mobilfunknetz. Behandlungshinweise, Medikamentendosierungen und regionale Besonderheiten sollen klar strukturiert und sofort auffindbar sein.
          </p>
          <p>
            Für die Menschen, die Inhalte erstellen und aktualisieren — etwa ärztliche Leitungen — soll es eine einfache Möglichkeit geben, Änderungen einzupflegen, ohne technisches Wissen zu benötigen.
          </p>
          <p>
            Das Wichtigste: Das System soll an lokale Gegebenheiten anpassbar sein. Was in Bayern gilt, muss nicht in Niedersachsen gelten — und beides soll sich auf derselben Plattform abbilden lassen.
          </p>
        </div>
      </div>

    </section>
  );
}
