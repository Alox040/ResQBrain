Erstelle die Datei `apps/website/components/sections/CtaSection.tsx` als statische Next.js-Komponente in TypeScript und TSX.

Sprache und Inhalte:
- Alle sichtbaren Texte auf Deutsch.
- Verwende exakt diese Inhalte:
  - Section-Überschrift: `Mach mit`
  - Unterzeile:
    - `ResQBrain wird gemeinsam mit der Community entwickelt.`
    - `Dein Feedback formt das Produkt.`
  - Fünf CTA-Karten in exakt dieser Reihenfolge:
    1. Aktion: `Feedback geben`
       Beschreibung: `Teile deine Erfahrungen aus dem Rettungsdienst`
       Button-Label: `Feedback geben`
       Ziel: `#`
    2. Aktion: `Idee einreichen`
       Beschreibung: `Schlage Features oder Verbesserungen vor`
       Button-Label: `Idee einreichen`
       Ziel: `#`
    3. Aktion: `Pilotpartner werden`
       Beschreibung: `Teste ResQBrain in deiner Organisation`
       Button-Label: `Pilotpartner werden`
       Ziel: `#`
    4. Aktion: `Projekt folgen`
       Beschreibung: `Bleib über Fortschritte informiert`
       Button-Label: `Folgen`
       Ziel: `#`
    5. Aktion: `Community beitreten`
       Beschreibung: `Diskutiere mit anderen im Rettungsdienst`
       Button-Label: `Community beitreten`
       Ziel: `#`

Technische Vorgaben:
- Next.js App Router kompatibel.
- Kein `use client`.
- Rein statische Komponente ohne State, ohne Props, ohne API-Calls.
- Tailwind CSS verwenden.
- Keine externen Abhängigkeiten.

Struktur und Layout:
- Root-Section mit `id="cta"`.
- Dunkler oder kräftiger Verlaufshintergrund innerhalb des Design-Systems.
- Überschrift und Unterzeile zentriert oben.
- Karten als responsives Grid.

Visuelle Anforderungen:
- Jede CTA-Card enthält Icon, Aktionstitel, kurze Beschreibung und Button.
- Primäre CTAs:
  - `Feedback geben`
  - `Pilotpartner werden`
- Diese beiden visuell stärker gewichten, nicht nur farblich.
- Sekundäre CTAs zurückhaltender gestalten.

Inhaltliche Regeln:
- Alle 5 CTAs anzeigen.
- Alle Links bleiben Platzhalter mit `href="#"`.
- Kein Formular.
- Kein Newsletter-Feld.
- Keine Tracking-Elemente.
- Keine Preisliste.

Implementierungsregeln:
- Verwende semantisches HTML.
- Falls kein Icon-System vorhanden ist, nutze einfache inline SVGs.
- Erfinde keine zusätzlichen Aktionen, Links oder Beschreibungstexte.
- Keine Annahmen über weitere Inhalte.

Ausgabe:
- Gib nur den vollständigen Inhalt von `apps/website/components/sections/CtaSection.tsx` zurück.
