function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="pt-2 border-t border-[#17233f] flex flex-col gap-1.5">
      <span className="text-[10px] text-[#4f7db3] uppercase tracking-widest">{number}</span>
      <h2 className="text-sm font-medium text-zinc-300">{title}</h2>
    </div>
  );
}

export function ProjectStatus() {
  return (
    <section id="status" className="flex flex-col gap-24 md:gap-32 border-t border-[#17233f] pt-20 lg:pt-32">

      {/* 04 — Aktueller Stand */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
        <div className="md:col-span-4 lg:col-span-3">
          <div className="sticky top-24">
            <SectionLabel number="04" title="Wo wir gerade stehen" />
          </div>
        </div>
        <div className="md:col-span-8 lg:col-span-7 flex flex-col gap-5 text-sm text-zinc-400 leading-relaxed font-light">
          <p>
            Das Projekt steckt noch in einer sehr frühen Phase. Bisher wurde hauptsächlich die Idee ausgearbeitet und eine erste Version der Benutzeroberfläche als Prototyp umgesetzt.
          </p>
          <p>
            Dieser Prototyp ist kein fertiges Produkt — er zeigt, wie die Anwendung später aussehen und sich anfühlen könnte. Er dient dazu, das Konzept mit Menschen aus dem Rettungsdienst zu besprechen und frühes Feedback einzuholen.
          </p>
          <p>
            Es gibt noch kein Backend, keine Datenbank und keine echten medizinischen Inhalte. Alles, was bisher existiert, ist eine Oberfläche zum Diskutieren und Weiterdenken.
          </p>

          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full bg-[#12b5ab]/60" />
              <span className="text-zinc-500">Anforderungen und Ideen gesammelt</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#12b5ab] relative">
                <span className="absolute inset-0 rounded-full bg-[#12b5ab] animate-ping opacity-50" />
              </span>
              <span className="text-zinc-300">Erster UI-Prototyp in Arbeit — Feedback wird gesammelt</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full bg-[#17233f] border border-[#4f7db3]/30" />
              <span className="text-zinc-600">Umsetzung als funktionierende Anwendung — noch offen</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full bg-[#17233f] border border-[#4f7db3]/30" />
              <span className="text-zinc-600">Einbindung realer Inhalte — noch offen</span>
            </div>
          </div>
        </div>
      </div>

      {/* 05 — Was geplant ist */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
        <div className="md:col-span-4 lg:col-span-3">
          <div className="sticky top-24">
            <SectionLabel number="05" title="Was als nächstes geplant ist" />
          </div>
        </div>
        <div className="md:col-span-8 lg:col-span-7 flex flex-col gap-5 text-sm text-zinc-400 leading-relaxed font-light">
          <p>
            Bevor mit der eigentlichen Entwicklung begonnen wird, soll der Prototyp ausgiebig mit Rettungsfachpersonal, Notärzten und ärztlichen Leitungen besprochen werden. Was fehlt? Was ist unklar? Was würde in der Praxis nicht funktionieren?
          </p>
          <p>
            Danach soll eine erste echte Version entstehen — zunächst für einen einzigen Rettungsdienstbereich, um das Konzept im Kleinen zu erproben. Schritt für Schritt soll daraus etwas werden, das breit eingesetzt werden kann.
          </p>
          <p>
            Das Projekt ist bewusst offen gestaltet. Es soll keine geschlossene Lösung werden, sondern etwas, das gemeinsam wächst.
          </p>
        </div>
      </div>

    </section>
  );
}
