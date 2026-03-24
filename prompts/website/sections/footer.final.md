Erstelle die Datei `apps/website/components/sections/Footer.tsx` als statische Next.js-Komponente in TypeScript und TSX.

Sprache und Inhalte:
- Alle sichtbaren Texte auf Deutsch.
- Verwende exakt diese Inhalte:
  - Marke:
    - `ResQBrain`
    - `Wissensplattform für den Rettungsdienst`
  - Projekthinweis:
    - `Community-getriebene Entwicklung · Early Stage Projekt`
  - Links:
    - `GitHub` → externer Platzhalter-Link
    - `Reddit` → externer Platzhalter-Link
    - `Kontakt` → `mailto:` Platzhalter
    - `Feedback` → `#feedback`
  - Copyright:
    - `© 2025 ResQBrain — Kein kommerzielles Produkt`

Technische Vorgaben:
- Next.js App Router kompatibel.
- Kein `use client`.
- Rein statische Komponente ohne State, ohne Props, ohne API-Calls.
- Tailwind CSS verwenden.
- Keine externen Abhängigkeiten.

Struktur und Layout:
- Root-Element als `<footer>` mit `id="footer"`.
- Dunkler Hintergrund.
- Gedimmter Text.
- Zweispaltiges Layout auf Desktop, einspaltig zentriert auf Mobile.
- Schmale Section mit oberer Trennlinie.

Visuelle Anforderungen:
- Markenname heller und stärker gewichtet.
- Projekthinweis kleiner und gedimmt.
- Links als reine Text-Links.
- Copyright immer als letzte Zeile.

Inhaltliche Regeln:
- Keine Social-Icons.
- Keine wiederholte Hauptnavigation.
- Keine Newsletter-Eingabe.
- Keine große Sitemap.
- Kein Cookie-Banner.

Implementierungsregeln:
- Externe Links mit `target="_blank"` und `rel="noopener noreferrer"`.
- Für Platzhalter-Links klare sichere Defaults verwenden:
  - GitHub: `#`
  - Reddit: `#`
  - Kontakt: `mailto:`
  - Feedback: `#feedback`
- Verwende semantisches HTML.
- Erfinde keine zusätzlichen Footer-Links oder Rechtstexte.
- Keine Annahmen über weitere Inhalte.

Ausgabe:
- Gib nur den vollständigen Inhalt von `apps/website/components/sections/Footer.tsx` zurück.
