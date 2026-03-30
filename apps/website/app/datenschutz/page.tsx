import type { Metadata } from "next";

import { AutoLinkText } from "@/components/legal/auto-link-text";
import { SimpleDocument } from "@/components/pages/simple-document";
import { datenschutzText } from "@/legal/datenschutz-content";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung — ResQBrain.",
};

export default function DatenschutzPage() {
  return (
    <main>
      <SimpleDocument
        title="Datenschutzerklärung"
        description="Textübernahme aus dem bestehenden Projektstand. Diese Ausgabe der Website enthält kein Kontaktformular; Abschnitt 5 beschreibt die Verarbeitung, falls ein solches Angebot ergänzt wird."
      >
        <AutoLinkText text={datenschutzText} />
      </SimpleDocument>
    </main>
  );
}
