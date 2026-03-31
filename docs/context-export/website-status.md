# Website-Status (Export)

**Vorhanden:** Ja — `apps/website/` (Next.js App Router).

## Next.js-Struktur

- **`apps/website/app/layout.tsx`** — Root-Layout: Inter-Font (`latin`, `latin-ext`), `lang="de"`, `SiteShell` um `children`, Metadaten mit `sitePublicUrl` aus `lib/site-content.ts`, `siteTitle` aus `lib/routes.ts`.
- **`apps/website/app/page.tsx`** — Startseite: rendert `HomePageSections` aus `components/home/home-page-sections.tsx`.
- **Weitere Routen:** `app/kontakt/page.tsx`, `app/links/page.tsx`, `app/mitwirkung/page.tsx`, `app/impressum/page.tsx`, `app/datenschutz/page.tsx`.
- **Next-Version:** `package.json` → `next ^16.2.1` (Build-Lauf: Next.js 16.2.1 mit Turbopack).

## Sections (Startseite)

Reihenfolge laut `components/home/home-page-sections.tsx`:

1. `HomeHero`  
2. `SurveyInviteSection`  
3. `ProblemBenefitsSection`  
4. `FeaturesOverviewSection`  
5. `AudiencesSection`  
6. `PilotFeedbackSection`  
7. `CollaborationSection`  
8. `FaqSection`  

(Frühere Export-Version mit `SurveysSection`, `RoadmapSection`, `CTASection`, `MobileStickyCTA` gehört zur **`apps/website-old/`-Struktur**, nicht zur aktiven `apps/website`.)

## Routing

| Route | Datei | Build-Modus (Lauf 31. März 2026) |
|-------|--------|----------------------------------|
| `/` | `app/page.tsx` | Static (○) |
| `/kontakt` | `app/kontakt/page.tsx` | Static |
| `/links` | `app/links/page.tsx` | Static |
| `/mitwirkung` | `app/mitwirkung/page.tsx` | Static |
| `/impressum` | `app/impressum/page.tsx` | Static |
| `/datenschutz` | `app/datenschutz/page.tsx` | Static |
| `/_not-found` | Framework | Static |

## Umfragen-Integration

- **`lib/public-config.ts`:** `surveyPublishedUrlFromCode` → Microsoft Forms (`forms.cloud.microsoft/r/ZFVgC0L1BZ`); letzte Umfrageergebnisse sind als externer Link hinterlegt. `NEXT_PUBLIC_RESQBRAIN_SURVEY_URL` überschreibt die veröffentlichte URL.
- **`lib/routes.ts`:** `resolveSurveyLink()` — externe HTTPS-URL wenn konfiguriert, sonst intern ` /mitwirkung#umfrage`.
- **`components/sections/survey-invite-section.tsx`:** Primär-CTA über `SurveyCtaLink`; sekundär Link nach `routes.kontakt`.
- **`app/mitwirkung/page.tsx`:** Erklärtexte und erneuter Umfrage-Zugang; kein eingebettetes Formular auf der Site.
- Kein separates Survey-Backend im Repository — nur konfigurierbare externe Links.

## CTA / Buttons

- **Umfrage-Bereich:** Text und Buttons in `SurveyInviteSection` (siehe oben); Kontakt über `Link` zu `/kontakt`.
- **Weitere CTAs:** abhängig von den jeweiligen Section-Komponenten (nicht jede Section hier einzeln zitiert).

## Deployment (Vercel)

- **`vercel.json` am Repository-Root:** u. a. `rootDirectory: "apps/website"`, gleiche install/build-Befehle wie die App, `outputDirectory: "apps/website/.next"`.
- **`apps/website/vercel.json`:** `framework`, `installCommand`, `buildCommand` — **ohne** `ignoreCommand` in dieser Datei.
- **`apps/website-old/vercel.json`:** weiterhin `ignoreCommand` → `node ../../scripts/vercel-ignore.js` (nur für diese Kopie nachweisbar).
- **Live-Deployment:** in diesem Export nicht per API oder Dashboard verifiziert.

## Encoding / Copy

- **`apps/website`:** Keine `TemporaryEncodingTest`-Komponente (Repo-Suche: Vorkommen nur unter `apps/website-old/components/debug/` und in alter Doku).
- Sichtbare Umlaute kommen in Metadaten und Section-Texten vor (keine ASCII-only-Pflicht für die gesamte Site aus diesem Export ableitbar).

## Duplikat / Legacy

- **`apps/website-old/`** — vollständigere alte Marketing-Site im Workspace.
- **Root `app/page.tsx`, `components/`** — nicht das deployte Website-Paket laut Root-`pnpm build` (siehe `deployment.md`).
