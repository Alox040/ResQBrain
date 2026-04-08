function SectionLabel({ number, title, accent = false }: { number: string; title: string; accent?: boolean }) {
  return (
    <div className={`pt-2 border-t flex flex-col gap-1.5 ${accent ? 'border-[#12b5ab]/40' : 'border-[#17233f]'}`}>
      <span className={`text-[10px] uppercase tracking-widest ${accent ? 'text-[#12b5ab]' : 'text-[#4f7db3]'}`}>{number}</span>
      <h2 className="text-sm font-medium text-zinc-300">{title}</h2>
    </div>
  );
}

export function ProjectParticipation() {
  return (
    <section id="participate" className="flex flex-col gap-24 md:gap-32 border-t border-[#17233f] pt-20 lg:pt-32">

      {/* 06 — Für wen es gedacht ist */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
        <div className="md:col-span-4 lg:col-span-3">
          <div className="sticky top-24">
            <SectionLabel number="06" title="Für wen es gedacht ist" />
          </div>
        </div>
        <div className="md:col-span-8 lg:col-span-7 flex flex-col gap-8 text-sm text-zinc-400 leading-relaxed font-light">
          <p>
            ResQBrain richtet sich an alle, die im Rettungsdienst arbeiten — unabhängig von ihrer Rolle.
          </p>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-zinc-200 font-medium text-sm">Rettungsfachpersonal</h3>
              <p className="text-zinc-500">
                Notfallsanitäter und Rettungssanitäter, die im Einsatz schnell und sicher nachschlagen möchten — ohne langes Suchen, ohne Netz, ohne Unsicherheit.
              </p>
            </div>
            <div className="w-8 h-[1px] bg-[#17233f]" />
            <div className="flex flex-col gap-2">
              <h3 className="text-zinc-200 font-medium text-sm">Notärzte</h3>
              <p className="text-zinc-500">
                Ärzte, die sich schnell über die lokalen Gegebenheiten und die Ausstattung des jeweiligen Rettungsmittels informieren möchten.
              </p>
            </div>
            <div className="w-8 h-[1px] bg-[#17233f]" />
            <div className="flex flex-col gap-2">
              <h3 className="text-zinc-200 font-medium text-sm">Ärztliche Leitungen</h3>
              <p className="text-zinc-500">
                Menschen, die Inhalte verantworten und veröffentlichen — und dabei eine einfache, nachvollziehbare Möglichkeit brauchen, Vorgaben aktuell zu halten.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 07 — Wie man mitmachen kann */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
        <div className="md:col-span-4 lg:col-span-3">
          <div className="sticky top-24">
            <SectionLabel number="07" title="Wie du mitmachen kannst" accent />
          </div>
        </div>
        <div className="md:col-span-8 lg:col-span-7">
          <div className="relative bg-[#0c1427]/60 border border-[#17233f] p-8 md:p-12 overflow-hidden group">

            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#12b5ab]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#12b5ab]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-6">

              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                Im Moment ist das Wichtigste: mit Menschen aus dem Rettungsdienst sprechen. Passt die Idee? Fehlt etwas? Was würde in der Praxis funktionieren, was nicht?
              </p>

              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                Dazu gibt es eine kurze Umfrage und die Möglichkeit, sich direkt zu melden. Jede Rückmeldung hilft — egal ob ein kurzer Satz oder ein ausführliches Gespräch.
              </p>

              <p className="text-sm text-zinc-500 leading-relaxed font-light">
                Wer sich langfristig einbringen möchte — etwa bei der Erstellung von Inhalten, beim Testen oder bei der Entwicklung — ist ebenfalls herzlich willkommen.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 pt-2">
                <a
                  href="#"
                  className="text-sm text-[#12b5ab] hover:text-[#1fe5d7] transition-colors underline underline-offset-4 decoration-[#12b5ab]/30 hover:decoration-[#12b5ab] w-max"
                >
                  Zur Umfrage
                </a>
                <a
                  href="#"
                  className="text-sm text-[#4f7db3] hover:text-zinc-300 transition-colors underline underline-offset-4 decoration-[#4f7db3]/30 hover:decoration-[#4f7db3] w-max"
                >
                  Kontakt aufnehmen
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
