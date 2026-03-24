Erstelle die Datei `apps/website/components/sections/UseCasesSection.tsx` als statische Next.js-Komponente in TypeScript und TSX.

Sprache und Inhalte:
- Alle sichtbaren Texte auf Deutsch.
- Verwende exakt diese Inhalte:
  - Section-Überschrift: `Für wen ist ResQBrain?`
  - Oberlabel: `Zielgruppen`
  - Vier Karten in exakt dieser Reihenfolge:
    1. Rolle: `Notfallsanitäter`
       Nutzen: `Schneller Zugriff auf Algorithmen und Medikamente direkt im Einsatz`
    2. Rolle: `Rettungsdienstorganisationen`
       Nutzen: `Eigene Algorithmen und SOPs verwalten und freigeben`
    3. Rolle: `Bildungseinrichtungen im Rettungsdienst`
       Nutzen: `Lernalgorithmen bereitstellen und aktuell halten`
    4. Rolle: `Leitender Notarzt / Ärztliche Leitung Rettungsdienst`
       Nutzen: `Inhalte freigeben, Versionen kontrollieren, Änderungen nachvollziehen`

Technische Vorgaben:
- Next.js App Router kompatibel.
- Kein `use client`.
- Rein statische Komponente ohne State, ohne Props, ohne API-Calls.
- Tailwind CSS verwenden.
- Keine externen Abhängigkeiten.

Struktur und Layout:
- Root-Section mit `id="use-cases"`.
- Leicht heller Hintergrund oder sehr dezenter Gradient innerhalb des Design-Systems.
- Grid mit 2x2 auf Desktop und 1 Spalte auf Mobile.
- Karten gleich groß und klar getrennt.

Visuelle Anforderungen:
- Oberhalb der Überschrift ein rotes Label `Zielgruppen`.
- Jede Karte enthält oben ein einfaches Icon oder Avatar-Platzhalter.
- Rollenname als klarer Titel.
- Nutzentext als sekundärer Fließtext.
- Linker roter Akzentstreifen an jeder Karte.

Inhaltliche Regeln:
- Genau 4 Use Cases.
- Keine Testimonials.
- Keine Fotos.
- Keine externen Links.
- Keine individuellen CTAs pro Karte.

Implementierungsregeln:
- Verwende semantisches HTML.
- Falls kein Icon-System vorhanden ist, nutze einfache inline SVGs.
- Erfinde keine weiteren Rollen, Nutzen-Texte oder Zwischenüberschriften.
- Keine Annahmen über weitere Inhalte.

Ausgabe:
- Gib nur den vollständigen Inhalt von `apps/website/components/sections/UseCasesSection.tsx` zurück.
