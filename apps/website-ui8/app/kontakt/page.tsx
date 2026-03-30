import type { Metadata } from "next";

import { SimpleDocument } from "@/components/pages/simple-document";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontakt — Platzhalterseite (UI8).",
};

export default function KontaktPage() {
  return (
    <main>
      <SimpleDocument
        title="Kontakt"
        description="Statische Platzhalterangaben — kein Formular, kein Backend."
      >
        <p>
          <strong>E-Mail (Beispiel):</strong>{" "}
          <a
            className="text-[var(--color-primary)] underline underline-offset-2 hover:text-[var(--color-primary-hover)]"
            href="mailto:kontakt@example.com"
          >
            kontakt@example.com
          </a>
        </p>
        <p>
          <strong>Telefon (Beispiel):</strong> +49 30 00000000
        </p>
        <p>
          <strong>Anschrift (Beispiel):</strong>
          <br />
          Musterfirma GmbH
          <br />
          Musterstraße 1
          <br />
          10115 Berlin
        </p>
      </SimpleDocument>
    </main>
  );
}
