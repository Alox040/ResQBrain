Erstelle die Datei `apps/website/components/sections/ProblemSection.tsx` als statische Next.js-Komponente in TypeScript und TSX.

Sprache und Inhalte:
- Alle sichtbaren Texte auf Deutsch.
- Verwende exakt diese Inhalte:
  - Section-Überschrift: `Das Problem`
  - Unterzeile: `Wissen im Rettungsdienst ist fragmentiert`
  - Probleme in exakt dieser Reihenfolge:
    1. `Unterschiedliche Algorithmen je nach Region`
    2. `Medikamentenlisten nicht zentral gepflegt`
    3. `SOPs in PDFs oder Dokumenten verteilt`
    4. `Änderungen schwer nachvollziehbar`
    5. `Wissen auf mehrere Quellen verteilt`
    6. `Keine zentrale Wissensplattform`

Technische Vorgaben:
- Next.js App Router kompatibel.
- Kein `use client`.
- Rein statische Komponente ohne State, ohne Props, ohne API-Calls.
- Tailwind CSS verwenden.
- Keine externen Abhängigkeiten.

Struktur und Layout:
- Root-Section mit `id="problem"`.
- Heller Hintergrund.
- Zentrierte Überschrift.
- Grid mit 2 Spalten auf Desktop und 1 Spalte auf Mobile.
- Jede Problem-Aussage als eigenständige Card.

Visuelle Anforderungen:
- Oberhalb oder an der Überschrift ein rotes Label `Herausforderung`.
- Jede Card enthält links ein einfaches Warn-/Problem-Icon und rechts den Text.
- Weiße Cards mit klarer Border.
- Kein Hover-Effekt erforderlich.

Inhaltliche Regeln:
- Keine Lösungshinweise.
- Keine CTA-Buttons.
- Keine Statistiken.
- Keine unbelegten Zahlen.
- Keine externen Links.
- Reihenfolge exakt beibehalten.

Implementierungsregeln:
- Verwende semantisches HTML.
- Falls kein Icon-System vorhanden ist, nutze einfache inline SVGs.
- Erfinde keine zusätzlichen Problemkarten oder Texte.
- Keine Annahmen über weitere Inhalte.

Ausgabe:
- Gib nur den vollständigen Inhalt von `apps/website/components/sections/ProblemSection.tsx` zurück.
