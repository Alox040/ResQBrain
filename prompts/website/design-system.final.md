Erstelle zwei Dateien für das ResQBrain Website-Design-System:
- `apps/website/app/globals.css`
- `apps/website/tailwind.config.ts`

Ziel:
- Definiere ein klares, konsistentes visuelles Grundsystem für die Website.
- Verwende ausschließlich die vorgegebenen Farben, Abstände und Komponentenvarianten.
- Halte die Lösung Next.js- und Tailwind-kompatibel.

Farbdefinitionen:
- Primär/Akzent:
  - Rot 600: `#DC2626`
  - Rot 700: `#B91C1C`
  - Rot 50: `#FEF2F2`
- Neutrale Farben:
  - Hintergrund hell: `#FFFFFF`
  - Hintergrund dunkel: `#0F172A`
  - Text primär: `#0F172A`
  - Text sekundär: `#64748B`
  - Border: `#E2E8F0`
- Statusfarben:
  - Geplant: Hintergrund `#F1F5F9`, Text slate-500
  - Aktiv: Hintergrund `#DCFCE7`, Text green-700
  - Early Stage: Hintergrund `#FEF9C3`, Text yellow-700

Typografie:
- Primärschrift: System-Font-Stack
- Fallback: `ui-sans-serif, system-ui, sans-serif`
- Typo-Skala:
  - Hero: `text-5xl font-bold`
  - Section-Headline: `text-3xl font-bold`
  - Card-Titel: `text-xl font-semibold`
  - Fließtext: `text-base`
  - Labels/Badges/Footer: `text-sm`

Layout-Werte:
- Max-Width: `max-w-6xl`
- Seitenabstand: `px-4 md:px-8`
- Section Padding: `py-16 md:py-24`
- Card Gap: `gap-6`

Komponentenvarianten:
- Primary Button:
  - roter Hintergrund
  - weiße Schrift
  - Hover auf dunkleres Rot
  - `px-6 py-3`
  - `rounded-lg`
- Secondary/Ghost Button:
  - transparenter Hintergrund
  - Border in Slate
  - Slate-Text
  - heller Hover
- Badge:
  - `rounded-full px-3 py-1 text-sm font-medium`
  - Varianten für `geplant`, `aktiv`, `early-stage`
- Card:
  - weißer Hintergrund
  - Border
  - `rounded-xl`
  - `shadow-sm`
  - `p-6`

Dark Mode:
- Nicht aktivieren.
- Nur die Struktur über CSS Custom Properties vorbereiten.

Regeln:
- Farben in `tailwind.config.ts` erweitern.
- Keine Hex-Werte inline in Komponenten voraussetzen.
- Kein Custom CSS außerhalb von `globals.css`.
- Keine `style`-Attribute.
- Keine Schatten über `shadow-md`.
- Animationen nur dezent, z. B. `transition-colors duration-200`.
- Keine Annahmen über zusätzliche Tokens.

Ausgabeformat:
- Gib zuerst den vollständigen Inhalt von `apps/website/tailwind.config.ts` zurück.
- Gib danach den vollständigen Inhalt von `apps/website/app/globals.css` zurück.
- Trenne beide Dateien eindeutig mit ihren Dateipfaden als Überschrift.
