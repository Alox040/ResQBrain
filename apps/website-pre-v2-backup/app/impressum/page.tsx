import type { Metadata } from "next";

import { AutoLinkText } from "@/components/legal/auto-link-text";
import { SimpleDocument } from "@/components/pages/simple-document";
import { impressumText } from "@/legal/impressum-content";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum — ResQBrain.",
};

export default function ImpressumPage() {
  return (
    <main>
      <SimpleDocument
        title="Impressum"
        description="Angaben gemäß den übernommenen Inhalten aus dem bestehenden Projektstand."
      >
        <AutoLinkText text={impressumText} />
      </SimpleDocument>
    </main>
  );
}
