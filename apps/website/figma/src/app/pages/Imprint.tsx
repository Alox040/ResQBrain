export function Imprint() {
  return (
    <div className="animate-in fade-in duration-700 max-w-3xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 mb-8">Impressum</h1>
      
      <div className="space-y-8 text-zinc-400 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-medium text-zinc-100 mb-3">Angaben gemäß § 5 TMG</h2>
          <p>
            Max Mustermann<br />
            Musterstraße 1<br />
            12345 Musterstadt
          </p>
          <p className="mt-4 text-xs italic">
            (Dies ist eine Platzhalter-Seite für ein fiktives Projektkonzept. Das Projekt ist nicht kommerziell.)
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-100 mb-3">Kontakt</h2>
          <p>
            Telefon: +49 (0) 123 44 55 66<br />
            E-Mail: info@resqbrain-placeholder.de
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-100 mb-3">Haftung für Inhalte</h2>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          </p>
        </section>
      </div>
    </div>
  );
}
