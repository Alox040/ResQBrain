export function Project() {
  return (
    <div className="animate-in fade-in duration-700 max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <div className="space-y-16">
        <header>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-50 mb-6">
            Das Projekt
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            ResQBrain ist aus der Beobachtung entstanden, dass Rettungsdienste oft mit veralteten
            PDF-Dateien, unuebersichtlichen Intranets oder physischen Taschenbuch-Loesungen
            arbeiten muessen, um auf fachlich freigegebene Inhalte zuzugreifen.
          </p>
        </header>

        <section className="space-y-6">
          <h2 className="text-2xl font-medium text-zinc-100">Die Ausgangslage</h2>
          <div className="prose prose-invert prose-zinc max-w-none text-zinc-400">
            <p>
              Medizinische Leitlinien entwickeln sich stetig weiter, und jeder aerztliche Leiter
              Rettungsdienst (AELRD) oder jede medizinische Leitung hat spezifische Vorgaben,
              welche Inhalte in ihrem Bereich gelten. Die Pflege und Verteilung dieser
              Informationen ist zeitaufwendig und fehleranfaellig.
            </p>
            <p>
              Oft gibt es keine einfache Moeglichkeit sicherzustellen, dass jede Fachkraft mobil
              exakt die gerade gueltige Version einer SOP (Standard Operating Procedure) vor sich
              hat.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-medium text-zinc-100">Unsere Vision</h2>
          <div className="prose prose-invert prose-zinc max-w-none text-zinc-400">
            <p>
              Wir konzipieren eine Plattform, die das Strukturieren und Ausspielen dieses Wissens
              drastisch vereinfacht:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>
                <strong>Dezentrale Verwaltung:</strong> Jede Organisation oder jeder
                Rettungsdienstbereich pflegt die eigenen Inhalte autonom.
              </li>
              <li>
                <strong>Revisionssicherheit:</strong> Jede Aenderung wird nachverfolgt. Es ist
                jederzeit abrufbar, welche SOP an einem bestimmten Datum gueltig war (wichtig fuer
                Qualitaetsmanagement und Dokumentationsfragen).
              </li>
              <li>
                <strong>Einfache Konsumierbarkeit:</strong> Das Wissen soll in einer Form
                bereitgestellt werden, die in alltaeglichen Arbeitskontexten schnelles,
                unkompliziertes Nachschlagen ermoeglicht.
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-6 p-8 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <h2 className="text-xl font-medium text-zinc-100">Aktueller Status: Feedback-Phase</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Derzeit gibt es noch kein fertiges Produkt. Wir befinden uns in der Phase der
            Anforderungsanalyse und dem Erstellen erster UI-Konzepte. Bevor wir eine Zeile Code
            fuer das finale Backend schreiben, moechten wir sicherstellen, dass die Funktionen
            genau den Schmerzpunkt der Anwender treffen. Wir suchen daher aktiv das Gespraech mit
            Rettungsdiensten, AELRDs und Notfallsanitaetern.
          </p>
        </section>
      </div>
    </div>
  );
}
