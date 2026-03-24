Erstelle die Datei `apps/website/components/layout/Navigation.tsx` als Next.js-kompatible React-Komponente in TypeScript und TSX.

Sprache und Inhalte:
- Alle sichtbaren Texte auf Deutsch.
- Verwende exakt diese Inhalte:
  - Marke: `ResQBrain`
  - Navigationslinks in exakt dieser Reihenfolge:
    1. `Problem` → `#problem`
    2. `Lösung` → `#loesung`
    3. `Features` → `#features`
    4. `Use Cases` → `#use-cases`
    5. `Status` → `#status`
  - Rechter CTA-Button:
    - Label: `Feedback geben`
    - Ziel: `#feedback`

Technische Vorgaben:
- Die Komponente verwendet `use client`.
- Next.js App Router kompatibel.
- TypeScript und TSX verwenden.
- Keine externen Abhängigkeiten außer React und Next.js.

Verhalten:
- Sticky Top-Navigation.
- Beim Scrollen oben sichtbar bleiben.
- Leicht transparenter Hintergrund mit Backdrop-Blur.
- Beim Scrollen opaker werden.
- Aktiven Abschnitt per Intersection Observer visuell markieren.
- Mobile-Version mit Hamburger-Button und vertikalem Menü.
- Mobile-Menü schließt bei Link-Klick.

Barrierefreiheit:
- `<nav aria-label="Hauptnavigation">`
- Hamburger-Button mit `aria-expanded` und `aria-controls`
- Saubere Fokus-Reihenfolge für Desktop und Mobile

Struktur und Layout:
- Desktop: Marke links, Hauptlinks mittig oder rechts, CTA rechts.
- Mobile: Marke und Hamburger oben, Menü ausklappbar darunter.
- Nur Anker-Links verwenden.

Regeln:
- Kein Routing über externe Bibliotheken.
- Kein Zustand außer:
  - Menü offen/geschlossen
  - aktiver Abschnitt
- Keine Dropdown-Menüs.
- Keine Auth-Links.
- Keine Annahmen über weitere Navigationspunkte.

Implementierungsregeln:
- Verwende sauberes, deterministisches State-Handling.
- Wenn nötig, mit `useEffect` und `useState` arbeiten.
- Nutze semantisches HTML.
- Tailwind CSS verwenden.
- Erfinde keine zusätzlichen Links oder Buttons.

Ausgabe:
- Gib nur den vollständigen Inhalt von `apps/website/components/layout/Navigation.tsx` zurück.
