import { HeroPlaceholder } from "@/components/sections/hero-placeholder";
import { PlaceholderSection } from "@/components/sections/placeholder-section";

export function HomePageSections() {
  return (
    <>
      <HeroPlaceholder />
      <PlaceholderSection id="leistungen" eyebrow="Bereich" title="Leistungen (Platzhalter)">
        <p>
          Kurze Einleitung zu einem späteren Leistungsblock — z. B. Inhalte, Pakete, Organisationssicht. Nur
          statischer Text.
        </p>
      </PlaceholderSection>
      <PlaceholderSection id="ablauf" eyebrow="Prozess" title="Ablauf (Platzhalter)">
        <p>Schrittfolge oder Timeline folgt im Design — hier nur Absatzplatzhalter für die UI8-Struktur.</p>
      </PlaceholderSection>
      <PlaceholderSection id="zielgruppen" eyebrow="Für wen" title="Zielgruppen (Platzhalter)">
        <p>Tabellen oder Karten für Rollen / Organisationen können hier später eingebunden werden.</p>
      </PlaceholderSection>
      <PlaceholderSection id="vertrauen" eyebrow="Vertrauen" title="Referenzen und Vertrauen (Platzhalter)">
        <p>Zitate, Logos, Zertifikate — noch nicht befüllt.</p>
      </PlaceholderSection>
      <PlaceholderSection id="kontakt-hinweis" eyebrow="Nächster Schritt" title="Kontakt (Hinweis)">
        <p>
          Für Rückfragen nutzen Sie die Kontaktseite — ebenfalls nur mit statischen Platzhalterdaten, ohne
          Formular-Backend.
        </p>
      </PlaceholderSection>
    </>
  );
}
