# Website-Status (Export)

**Vorhanden:** Ja — `apps/website/` (Next.js App Router).

## Next.js-Struktur

- **`apps/website/app/layout.tsx`** — Root-Layout: Inter-Font (latin + latin-ext), `lang="de"`, Header, `children`, Footer-Links aus `getLegalViewModel()`.
- **`apps/website/app/page.tsx`** — Startseite: komponiert Sections (Hero, Surveys, Roadmap, Problem, Solution, Features, Use Cases, Trust, CTA, Footer, `MobileStickyCTA`).
- **`apps/website/app/impressum/page.tsx`**, **`apps/website/app/datenschutz/page.tsx`** — Rechtstexte (Imports aus `legal/`).
- **Next-Version:** `package.json` → `next ^16.2.1` (Build-Output im Export-Lauf: Next.js 16.2.1 mit Turbopack).

## Sections (Startseite)

Reihenfolge laut `app/page.tsx`:

1. HeroSection  
2. SurveysSection  
3. RoadmapSection  
4. ProblemSection  
5. SolutionSection  
6. FeatureSection  
7. UseCasesSection  
8. TrustSection  
9. CTASection  
10. FooterSection  
11. MobileStickyCTA  

## Routing

| Route | Datei | Build-Modus (Export-Lauf) |
|-------|--------|---------------------------|
| `/` | `app/page.tsx` | Static (○) |
| `/impressum` | `app/impressum/page.tsx` | Static |
| `/datenschutz` | `app/datenschutz/page.tsx` | Static |
| `/_not-found` | Framework | Static |

## Umfragen-Integration

- **`components/sections/SurveysSection.tsx`:** Zwei Einträge mit festen URLs:
  - `https://forms.cloud.microsoft/r/tw508dTuDK` (Status „active“)
  - `https://forms.cloud.microsoft/r/quaHYEbjAC` (Status „completed“)
- Kein separates Survey-Backend im Repository-Auszug — nur externe Formular-Links.

## CTA / Buttons

- **`CTASection.tsx`:** Nutzt `getContactViewModel()` aus `lib/site-selectors.ts`:
  - Primärer Button: `contactHref` → `mailto:triggerhub@outlook.com` mit Betreff „Kontakt ResQBrain“ (E-Mail aus `lib/site.ts`: `contact.email`).
  - Sekundär: `learnMoreHref` → `mailto:` mit Betreff „Mehr erfahren ResQBrain“.
- **`MobileStickyCTA`:** Konstante `ENABLE_MOBILE_STICKY_CTA = false` — rendert `null` (Pilot-Sticky-CTA deaktiviert).

## Deployment (Vercel)

- **`apps/website/vercel.json`:**  
  `"ignoreCommand": "node ../../scripts/vercel-ignore.js"`
- **`scripts/vercel-ignore.js`:** Build wird **übersprungen** (Exit **0**), wenn `VERCEL_GIT_COMMIT_REF` nicht in `{main, master}`; sonst Exit **1** (= Build **nicht** ignorieren).  
- **Live-Deployment:** in diesem Export nicht per API oder Dashboard verifiziert.

## Bekannte UI-/Copy-Besonderheiten

- **`lib/site.ts`:** Teilstrings bewusst ohne Umlaute (z. B. `"Loesung"` in Navigation, `"Plattform fuer"` in description) — ASCII-Ersatzdarstellung in Konfiguration.
- **`SurveysSection.tsx`:** Text „fuer“ / „besser“ ohne Umlaute in sichtbaren Strings.

## Encoding / Debug

- **`components/debug/TemporaryEncodingTest.tsx`:** Zeigt Unicode-Escape-Sequenzen (`\u00E4` etc.) im JSX-String — **nur** diese Datei gefunden; **kein** Import dieser Komponente an anderer Stelle im Repo (Suche nach `TemporaryEncodingTest` nur Treffer in der Datei selbst).

## Duplikat / Legacy am Repo-Root

- Zusätzlich existieren **`/app/page.tsx`** und **`/components/`** am Root mit anderer Section-Zusammenstellung und Imports wie `@/components/sections/hero` — **nicht** das deployte Website-Paket laut Root-`pnpm build` (siehe `deployment.md`).
