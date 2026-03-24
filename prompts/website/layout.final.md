Erstelle die Datei `apps/website/app/layout.tsx` als Root-Layout für die ResQBrain Website in Next.js App Router mit TypeScript und TSX.

Ziel:
- Das Layout bindet die globale Seitenstruktur ein.
- Die Navigation wird als oberste sichtbare Komponente eingebunden.
- Die Seite bleibt Next.js-kompatibel und komponentenbasiert.

Technische Vorgaben:
- Next.js App Router kompatibel.
- TypeScript verwenden.
- Kein unnötiges `use client`.
- `children` als Inhalt der Seite rendern.
- Globales Styling über `./globals.css` importieren.

Einbindung:
- Importiere `Navigation` aus `apps/website/components/layout/Navigation.tsx`.
- Rendere `Navigation` oberhalb von `{children}`.

Struktur:
- Definiere ein Root-Layout mit `html` und `body`.
- Setze `lang="de"`.
- Nutze eine saubere Body-Struktur, die mit einer Sticky-Navigation funktioniert.
- Halte die Struktur minimal und deterministisch.

Regeln:
- Keine zusätzliche Seitenlogik.
- Keine API-Calls.
- Keine Annahmen über Fonts, Provider, Analytics oder externe Skripte.
- Keine weiteren Layout-Bestandteile hinzufügen, die nicht vorgegeben sind.

Ausgabe:
- Gib nur den vollständigen Inhalt von `apps/website/app/layout.tsx` zurück.
