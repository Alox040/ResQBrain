Erstelle die Datei `apps/website/components/sections/FeaturesSection.tsx` als statische Next.js-Komponente in TypeScript und TSX.

Sprache und Inhalte:
- Alle sichtbaren Texte auf Deutsch.
- Verwende exakt diese Inhalte:
  - Section-Überschrift: `Features`
  - Oberlabel: `Was ResQBrain kann`
  - Feature-Liste in exakt dieser Reihenfolge:
    1. `Versionierte Algorithmen` — Status `Verfügbar`
    2. `Medikamentenlisten` — Status `Verfügbar`
    3. `SOP Verwaltung` — Status `Verfügbar`
    4. `Mehrere Organisationen` — Status `Verfügbar`
    5. `Offline Zugriff` — Status `Geplant`
    6. `KI Suche` — Status `Geplant`

Technische Vorgaben:
- Next.js App Router kompatibel.
- Kein `use client`.
- Rein statische Komponente ohne State, ohne Props, ohne API-Calls.
- Tailwind CSS verwenden.
- Keine externen Abhängigkeiten.

Struktur und Layout:
- Root-Section mit `id="features"`.
- Heller Hintergrund.
- Zentrierte Überschrift.
- Card-Grid mit 3 Spalten auf Desktop, 2 auf Tablet, 1 auf Mobile.
- Jede Card gleichwertig und sauber getrennt.

Visuelle Anforderungen:
- Jede Feature-Card enthält:
  - ein thematisch passendes Icon oben
  - den Feature-Namen als Titel
  - ein Status-Badge unten rechts
- Badge-Farben:
  - `Verfügbar` als grüne Variante
  - `Geplant` als graue/slate Variante

Icon-Zuordnung:
- `Versionierte Algorithmen`: Branch-, Layer- oder Versions-Icon
- `Medikamentenlisten`: Pillen-, Liste- oder Medizin-Icon
- `SOP Verwaltung`: Datei-, Clipboard- oder Dokument-Icon
- `Mehrere Organisationen`: Building-, Team- oder Organisations-Icon
- `Offline Zugriff`: Download- oder Offline-Icon
- `KI Suche`: Suche- oder KI-Icon

Inhaltliche Regeln:
- Alle 6 Features anzeigen.
- Keine Verlinkung auf Detailseiten.
- Keine Pricing-Elemente.
- Keine Vergleichstabellen.
- Keine externen Links.

Implementierungsregeln:
- Falls kein Icon-System vorhanden ist, nutze einfache inline SVGs.
- Verwende für jede Card dieselbe Grundstruktur.
- Erfinde keine zusätzlichen Features, Beschreibungen oder Stati.
- Keine Annahmen über weitere Inhalte.

Ausgabe:
- Gib nur den vollständigen Inhalt von `apps/website/components/sections/FeaturesSection.tsx` zurück.
