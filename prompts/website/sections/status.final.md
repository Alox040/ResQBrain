Erstelle die Datei `apps/website/components/sections/StatusSection.tsx` als statische Next.js-Komponente in TypeScript und TSX.

Sprache und Inhalte:
- Alle sichtbaren Texte auf Deutsch, außer dem explizit vorgegebenen Badge-Text.
- Verwende exakt diese Inhalte:
  - Section-Überschrift: `Projektstatus`
  - Timeline-Schritte in exakt dieser Reihenfolge:
    1. `Frühe Entwicklungsphase` — abgeschlossen
    2. `Architekturphase` — abgeschlossen
    3. `Community Feedback Sammlung` — aktuell aktiv
    4. `Pilotbetrieb` — ausstehend
    5. `MVP Release` — ausstehend
  - Textblock:
    - `ResQBrain befindet sich in der frühen Entwicklungsphase.`
    - `Die Architektur ist definiert. Jetzt suchen wir Feedback und Pilotpartner aus dem Rettungsdienst.`
  - Badge: `Early Stage — Offen für Feedback`

Technische Vorgaben:
- Next.js App Router kompatibel.
- Kein `use client`.
- Rein statische Komponente ohne State, ohne Props, ohne API-Calls.
- Tailwind CSS verwenden.
- Keine externen Abhängigkeiten.

Struktur und Layout:
- Root-Section mit `id="status"`.
- Heller Hintergrund.
- Timeline vertikal auf Mobile und horizontal auf Desktop.
- Textblock zentriert unter der Timeline.

Visuelle Anforderungen:
- Abgeschlossen: grüner Kreis mit Checkmark.
- Aktiv: roter Kreis mit Pfeil und dezenter Puls-Animation.
- Ausstehend: grauer leerer Kreis.
- Verbindungslinien zwischen den Schritten.
- Badge in gelb/amber klar sichtbar.

Inhaltliche Regeln:
- Aktiver Schritt ist ausschließlich `Community Feedback Sammlung`.
- Keine Datumsangaben.
- Keine Prozent-Fortschrittsanzeige.
- Keine Versionsnummern.
- Kein GitHub-Widget.

Implementierungsregeln:
- Verwende semantisches HTML.
- Falls kein Icon-System vorhanden ist, nutze einfache inline SVGs.
- Animation nur auf dem aktiven Schritt und nur dezent.
- Erfinde keine zusätzlichen Statusphasen.
- Keine Annahmen über weitere Inhalte.

Ausgabe:
- Gib nur den vollständigen Inhalt von `apps/website/components/sections/StatusSection.tsx` zurück.
