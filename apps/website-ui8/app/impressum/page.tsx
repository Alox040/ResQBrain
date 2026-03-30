import type { Metadata } from "next";

import { SimpleDocument } from "@/components/pages/simple-document";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum — Platzhalter (UI8).",
};

export default function ImpressumPage() {
  return (
    <main>
      <SimpleDocument title="Impressum" description="Rechtliche Angaben folgen — derzeit nur Platzhaltertext.">
        <p>
          Diese Seite ist Teil des UI8-Statikgerüsts. Es werden keine rechtsgültigen Impressumsdaten dargestellt.
          Bitte ersetzen Sie alle Angaben durch die vom Verantwortlichen freigegebenen Inhalte.
        </p>
        <p>
          <strong>Verantwortlich (Beispiel):</strong>
          <br />
          Musterfirma GmbH · Musterstraße 1 · 10115 Berlin
        </p>
        <p>
          <strong>Kontakt (Beispiel):</strong>{" "}
          <a
            className="text-[var(--color-primary)] underline underline-offset-2 hover:text-[var(--color-primary-hover)]"
            href="mailto:info@example.com"
          >
            info@example.com
          </a>
        </p>
      </SimpleDocument>
    </main>
  );
}
