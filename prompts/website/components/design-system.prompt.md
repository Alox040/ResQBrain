# ================================
# FILE: prompts/website/components/design-system.prompt.md
# Blueprint Prompt: Design System
# ================================

## Ziel

Visuelles Grundsystem für die ResQBrain Website.
Definiert Farben, Typografie, Abstände, Komponenten-Varianten.
Wird von allen Section-Komponenten konsumiert.

---

## Zieldatei

`apps/website/app/globals.css` (CSS Custom Properties)
`apps/website/tailwind.config.ts` (Tailwind Erweiterungen)

---

## Farbpalette

### Primärfarbe
- Akzent: Rot (Rettungsdienst-Assoziation) — z.B. `#DC2626` (red-600)
- Primär-Dunkel: `#B91C1C` (red-700)
- Primär-Hell: `#FEF2F2` (red-50)

### Neutralfarben
- Hintergrund Hell: `#FFFFFF`
- Hintergrund Dunkel: `#0F172A` (slate-900)
- Text Primär: `#0F172A` (slate-900)
- Text Sekundär: `#64748B` (slate-500)
- Border: `#E2E8F0` (slate-200)

### Status / Highlight
- Badge "Geplant": `#F1F5F9` (slate-100) + Text slate-500
- Badge "Aktiv": `#DCFCE7` (green-100) + Text green-700
- Badge "Early Stage": `#FEF9C3` (yellow-100) + Text yellow-700

---

## Typografie

### Schriftart
- Primär: System-Font-Stack oder Inter (Google Fonts)
- Fallback: `ui-sans-serif, system-ui, sans-serif`

### Skala
| Klasse | Verwendung |
|---|---|
| `text-5xl font-bold` | Hero Headline |
| `text-3xl font-bold` | Section Headline |
| `text-xl font-semibold` | Card Title / Sub-Headline |
| `text-base` | Fließtext |
| `text-sm` | Labels, Badges, Footer |

---

## Abstände / Layout

- Max-Width: `max-w-6xl` (1152px)
- Seitenabstand: `px-4 md:px-8`
- Section Padding: `py-16 md:py-24`
- Card Gap: `gap-6`

---

## Komponenten-Varianten

### Button Primary
- Hintergrund: rot-600
- Text: weiß
- Hover: rot-700
- Padding: `px-6 py-3`
- Radius: `rounded-lg`

### Button Secondary / Ghost
- Hintergrund: transparent
- Border: 1px slate-300
- Text: slate-700
- Hover: slate-50

### Badge
- Inline-Block, `rounded-full px-3 py-1 text-sm font-medium`
- Varianten: geplant / aktiv / early-stage (siehe Farben oben)

### Card
- Hintergrund: weiß
- Border: 1px slate-200
- Radius: `rounded-xl`
- Shadow: `shadow-sm`
- Padding: `p-6`

---

## Dark Mode

Nicht in MVP-Phase.
Struktur vorbereiten (CSS Custom Properties), aber nicht aktivieren.

---

## Regeln

- Alle Farben über Tailwind-Config definieren — keine Hex-Werte inline
- Keine Schatten-Stacks > `shadow-md`
- Konsistente Rundungen: Buttons `rounded-lg`, Cards `rounded-xl`
- Animationen: dezent, `transition-colors duration-200` für Hover

---

## Nicht erlaubt

- Custom CSS außerhalb von globals.css und tailwind.config.ts
- Inline `style` Attribute
- Nicht-systemkonforme Farben ohne Eintrag in tailwind.config.ts

---

## Referenzen

- Website Plan: docs/context/website-plan.md
