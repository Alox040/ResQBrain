Erstelle die Datei `apps/website/app/page.tsx` für die ResQBrain Landingpage als statische Next.js-App-Router-Seite in TypeScript und TSX.

Ziel:
- Die Seite komponiert ausschließlich vorhandene Section-Komponenten.
- Keine eigene Geschäftslogik.
- Keine Inline-Inhalte.
- Keine API-Calls.
- Kein `use client`.

Importiere und rendere exakt diese Komponenten in exakt dieser Reihenfolge:
1. `HeroSection`
2. `ProblemSection`
3. `SolutionSection`
4. `FeaturesSection`
5. `UseCasesSection`
6. `StatusSection`
7. `CtaSection`
8. `Footer`

Pfadannahmen für die Komposition:
- `apps/website/components/sections/HeroSection.tsx`
- `apps/website/components/sections/ProblemSection.tsx`
- `apps/website/components/sections/SolutionSection.tsx`
- `apps/website/components/sections/FeaturesSection.tsx`
- `apps/website/components/sections/UseCasesSection.tsx`
- `apps/website/components/sections/StatusSection.tsx`
- `apps/website/components/sections/CtaSection.tsx`
- `apps/website/components/sections/Footer.tsx`

Technische Vorgaben:
- Next.js 14+ App Router kompatibel.
- TypeScript verwenden.
- Tailwind CSS darf nur für einfache Wrapper-Struktur genutzt werden.
- Vollständig statisch renderbar.
- Navigation wird nicht in `page.tsx` eingebunden.

Regeln:
- Keine zusätzliche Section.
- Keine abweichende Reihenfolge.
- Keine direkte HTML-Textblöcke als Ersatz für Komponenten.
- Keine Annahmen über Datenquellen.
- Keine Client-Logik.
- Saubere, deterministische Komposition.

Ausgabe:
- Gib nur den vollständigen Inhalt von `apps/website/app/page.tsx` zurück.
