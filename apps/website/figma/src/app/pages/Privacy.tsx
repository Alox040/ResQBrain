export function Privacy() {
  return (
    <div className="animate-in fade-in duration-700 max-w-3xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 mb-8">Datenschutzerklärung</h1>
      
      <div className="space-y-8 text-zinc-400 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-medium text-zinc-100 mb-3">1. Datenschutz auf einen Blick</h2>
          <h3 className="text-base font-medium text-zinc-200 mb-2 mt-4">Allgemeine Hinweise</h3>
          <p>
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
          </p>
          <p className="mt-4 text-xs italic">
            (Dies ist eine Platzhalter-Seite. Auf dieser Konzept-Website werden aktiv keine echten Nutzerdaten verarbeitet oder Tracking-Tools eingesetzt.)
          </p>
        </section>

        <section>
          <h2 className="text-lg font-medium text-zinc-100 mb-3">2. Datenerfassung auf dieser Website</h2>
          <h3 className="text-base font-medium text-zinc-200 mb-2 mt-4">Cookies</h3>
          <p>
            Unsere Internetseiten verwenden so genannte „Cookies“. Cookies sind kleine Textdateien und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert.
          </p>
          <h3 className="text-base font-medium text-zinc-200 mb-2 mt-4">Server-Log-Dateien</h3>
          <p>
            Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt.
          </p>
        </section>
      </div>
    </div>
  );
}
