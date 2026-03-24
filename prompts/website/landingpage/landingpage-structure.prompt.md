# ================================
# FILE: prompts/website/landingpage/landingpage-structure.prompt.md
# Blueprint Prompt: Landingpage Gesamtstruktur
# ================================

## Ziel

Vollständige Next.js Landingpage für ResQBrain.
Alle Sektionen in der korrekten Reihenfolge einbinden.
Keine eigene Logik — nur Komposition der Section-Komponenten.

---

## Zieldatei

`apps/website/app/page.tsx`

---

## Stack (Annahme)

Next.js 14+ App Router
TypeScript
Tailwind CSS

---

## Seitenreihenfolge

1. HeroSection
2. ProblemSection
3. SolutionSection
4. FeaturesSection
5. UseCasesSection
6. StatusSection
7. CtaSection
8. Footer

---

## Dateistruktur

```
apps/website/
├── app/
│   ├── page.tsx              ← Zieldatei
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── ProblemSection.tsx
│   │   ├── SolutionSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── UseCasesSection.tsx
│   │   ├── StatusSection.tsx
│   │   ├── CtaSection.tsx
│   │   └── Footer.tsx
│   ├── layout/
│   │   └── Navigation.tsx
│   └── ui/
│       └── (primitive components)
```

---

## Regeln

- Jede Section ist eine eigene Komponente — keine inline Inhalte in page.tsx
- Seitenreihenfolge exakt wie oben
- Navigation wird im layout.tsx eingebunden, nicht in page.tsx
- Kein direktes CSS in page.tsx — nur Tailwind utility classes
- Keine API calls auf dieser Seite
- Vollständig statisch renderbar (SSG)

---

## Nicht erlaubt

- Logik in page.tsx
- Direkte HTML-Blöcke ohne Komponenten
- Abweichende Sektionsreihenfolge
- Client-only Rendering (kein "use client" in page.tsx)

---

## Referenzen

- Sektionsinhalte: docs/context/website-plan.md
- Einzelne Komponenten: prompts/website/sections/*.prompt.md
- Navigation: prompts/website/layout/navigation.prompt.md
- Design System: prompts/website/components/design-system.prompt.md
