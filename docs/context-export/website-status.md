# Website-Status (Export)

**Vorhanden:** Ja - `apps/website/` und `apps/website-v2/` (beide Next.js App Router).

## Next.js-Struktur

- **`apps/website/app/layout.tsx`** — Root-Layout: Inter-Font (`latin`, `latin-ext`), `lang="de"`, `SiteShell` um `children`, Metadaten mit `sitePublicUrl` aus `lib/site-content.ts`, `siteTitle` aus `lib/routes.ts`.
- **`apps/website/app/page.tsx`** — Startseite: rendert `HomePageSections` aus `components/home/home-page-sections.tsx`.
- **Weitere Routen:** `app/kontakt/page.tsx`, `app/links/page.tsx`, `app/mitwirkung/page.tsx`, `app/impressum/page.tsx`, `app/datenschutz/page.tsx`.
- **Next-Version:** `package.json` → `next ^16.2.1` (Build-Lauf: Next.js 16.2.1 mit Turbopack).
- **`apps/website-v2`** hat eigenes `app/page.tsx`, eigene Sections und eigenes Routing-Modul (`lib/routes.ts`).

## Sections (Startseite)

### `apps/website`

Reihenfolge laut `components/home/home-page-sections.tsx`:

1. `HomeHero`  
2. `SurveyInviteSection`  
3. `ProblemBenefitsSection`  
4. `FeaturesOverviewSection`  
5. `AudiencesSection`  
6. `PilotFeedbackSection`  
7. `CollaborationSection`  
8. `FaqSection`  

### `apps/website-v2`

Reihenfolge laut `apps/website-v2/components/pages/home-page-sections.tsx`:

1. `HeroSection`
2. `TrustSection`
3. `ServicesSection`
4. `ProcessSection`
5. `RegionSection`
6. `ContactCtaSection`
7. `Footer`

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

`apps/website-v2/lib/routes.ts` definiert: `/`, `/kontakt`, `/links`, `/mitwirkung` (mit Alias-Feldern `kontakt`/`mitwirkung`).

## Umfragen-Integration

- **`lib/public-config.ts`:** `surveyPublishedUrlFromCode` → Microsoft Forms (`forms.cloud.microsoft/r/ZFVgC0L1BZ`); letzte Umfrageergebnisse sind als externer Link hinterlegt. `NEXT_PUBLIC_RESQBRAIN_SURVEY_URL` überschreibt die veröffentlichte URL.
- **`lib/routes.ts`:** `resolveSurveyLink()` — externe HTTPS-URL wenn konfiguriert, sonst intern ` /mitwirkung#umfrage`.
- **`components/sections/survey-invite-section.tsx`:** Primär-CTA über `SurveyCtaLink`; sekundär Link nach `routes.kontakt`.
- **`app/mitwirkung/page.tsx`:** Erklärtexte und erneuter Umfrage-Zugang; kein eingebettetes Formular auf der Site.
- Kein separates Survey-Backend im Repository — nur konfigurierbare externe Links.
- **Website-v2:** `lib/site/survey.ts` enthält derzeit Placeholder-URL `https://example.com/survey`.

## CTA / Buttons

- **Umfrage-Bereich:** Text und Buttons in `SurveyInviteSection` (siehe oben); primärer CTA führt über `SurveyCtaLink` zur von `resolveSurveyLink()` bestimmten Ziel-URL; sekundärer CTA verlinkt nach `/kontakt`.
- **Weitere CTAs:** abhängig von den jeweiligen Section-Komponenten (nicht jede Section hier einzeln zitiert).
- **Website-v2 Contact-CTA:** `ContactCtaSection` verlinkt auf `routes.contact` (`/kontakt`) mit Text "Jetzt Kontakt aufnehmen".

## Deployment (Vercel)

- **`vercel.json` am Repository-Root:** u. a. `rootDirectory: "apps/website"`, gleiche install/build-Befehle wie die App, `outputDirectory: "apps/website/.next"`.
- **`apps/website/vercel.json`:** `framework`, `installCommand`, `buildCommand` — **ohne** `ignoreCommand` in dieser Datei.
- **`apps/website-v2/vercel.json`:** separates Build-Target `pnpm --filter @resqbrain/website-v2 build`.
- **`apps/website-old/vercel.json`:** weiterhin `ignoreCommand` → `node ../../scripts/vercel-ignore.js` (nur für diese Kopie nachweisbar).
- **Live-Deployment:** in diesem Export nicht per API oder Dashboard verifiziert.

## Encoding / Copy

- **`apps/website`:** Keine `TemporaryEncodingTest`-Komponente (Repo-Suche: Vorkommen nur unter `apps/website-old/components/debug/` und in alter Doku).
- Sichtbare Umlaute kommen in Metadaten und Section-Texten vor (keine ASCII-only-Pflicht für die gesamte Site aus diesem Export ableitbar).
- **`apps/website-v2`:** mehrere neue Texte sind bewusst ASCII geschrieben (`verlaesslich`, `unterstuetzt`, `fuer`), also kein aktueller Umlaut-Encoding-Fehler in diesen Komponenten.

## Duplikat / Legacy

- **`apps/website-old/`** — vollständigere alte Marketing-Site im Workspace.
- **Root `app/page.tsx`, `components/`** — nicht das deployte Website-Paket laut Root-`pnpm build` (siehe `deployment.md`).
