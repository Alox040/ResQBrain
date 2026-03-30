import type { Metadata } from "next";

import { SimpleDocument } from "@/components/pages/simple-document";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutz — Platzhalter (UI8).",
};

export default function DatenschutzPage() {
  return (
    <main>
      <SimpleDocument
        title="Datenschutz"
        description="Datenschutzerklärung folgt — derzeit nur Platzhalter ohne Rechtswirkung."
      >
        <p>
          Diese Seite ist ein struktureller Platzhalter. Es findet keine Datenverarbeitung durch dieses
          Gerüst statt; sobald echte Dienste angebunden werden, ist eine vollständige Datenschutzerklärung
          erforderlich.
        </p>
        <ul>
          <li>Keine Cookies oder Analytics in diesem Statikgerüst vorgesehen.</li>
          <li>Keine serverseitige Speicherung von Nutzerdaten durch diese Demo-App.</li>
        </ul>
      </SimpleDocument>
    </main>
  );
}
