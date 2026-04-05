# Website-Status (Export)

**Vorhanden:** `apps/website/` (Next.js App Router). Zusätzlich im Baum, nicht Workspace-Mitglied: `apps/website-old/`, `apps/website-pre-v2-backup/`. **`apps/website-v2/`** im aktuellen Repo **nicht** vorhanden.

**Letzte Verifikation (Export):** `pnpm build` (Root) Exit 0, Next.js 16.2.1 (5. April 2026).

## Next.js-Struktur

- **`apps/website/app/layout.tsx`** — `SiteShell`, Schrift `Instrument_Sans` (`next/font/google`, Subsets `latin`, `latin-ext`), `lang="de"`. Kommentar im Layout: UTF-8 über Next.js `<meta charSet="utf-8" />`, kein zweites Charset-Meta hier.
- **`apps/website/app/page.tsx`** — Startseite: importiert und rendert die Section-Komponenten in fester Reihenfolge (siehe unten).
- **Weitere Routen:** `app/kontakt/page.tsx`, `app/links/page.tsx`, `app/mitwirkung/page.tsx`, `app/impressum/page.tsx`, `app/datenschutz/page.tsx`.
- **`package.json`:** `next ^16.2.1` (frischer Build: Next.js **16.2.1** mit Turbopack).

## Sections (Startseite)

Reihenfolge laut `apps/website/app/page.tsx`:

1. `HeroSection`  
2. `ProblemSection`  
3. `IdeaSection`  
4. `StatusSection`  
5. `AudienceSection`  
6. `MitwirkungSection`  
7. `FaqSection`  
8. `ContactCtaSection`  

Inhalte primär aus `@/lib/site/content` (`content.ts`).

## Routing

| Route | Datei | Build-Modus (frischer `pnpm build`) |
|-------|--------|--------------------------------------|
| `/` | `app/page.tsx` | Static (○) |
| `/kontakt` | `app/kontakt/page.tsx` | Static |
| `/links` | `app/links/page.tsx` | Static |
| `/mitwirkung` | `app/mitwirkung/page.tsx` | Static |
| `/impressum` | `app/impressum/page.tsx` | Static |
| `/datenschutz` | `app/datenschutz/page.tsx` | Static |
| `/_not-found` | Framework | Static |

Navigation: `apps/website/lib/routes.ts` — `routes`, `mainNav`, `footerNav`.

## Umfragen-Integration

- **`lib/site/survey.ts`:** `href` und `url` zeigen auf **`https://example.com/survey`**, Label `"Umfrage"` (Platzhalter).
- **`lib/site/content.ts`** / **`lib/site/mitwirkung.ts`** / **`lib/site/links-page.ts`** beziehen sich auf `survey` (Import aus `./survey`).
- **`app/mitwirkung/page.tsx`:** Umfrage-Abschnitt mit `ButtonLink` auf konfigurierte `href` aus Seiteninhalt.
- Kein Survey-Backend im Repository — nur statische/externe URLs.

## CTA / Buttons

- Hero: primär `Mitwirkung` (`routes.mitwirkung`), sekundär `Projekt ansehen` (`routes.home`) laut `content.hero`.
- `MitwirkungSection`: CTA „Umfrage“ → `survey.href`.
- `ContactCtaSection`: konfigurierbar über `content.cta` (Button + `href`).

## Deployment (Vercel, dateibasiert)

- **Repository-Root `vercel.json`:** `rootDirectory: "apps/website"`, `buildCommand` / `outputDirectory` auf diese App.
- **`apps/website/vercel.json`:** `framework`, `installCommand`, `buildCommand` — **ohne** `ignoreCommand`.
- **`apps/website-old/vercel.json`:** `ignoreCommand` → `node ../../scripts/vercel-ignore.js`.
- Live-Deployment: in diesem Export nicht per API/Dashboard verifiziert.

## Encoding / Copy

- Layout dokumentiert bewusst ein Charset-Meta (siehe oben).
- Sichtbare deutsche Texte in `content.ts` und Sections mit Umlauten (z. B. „ständig“, „Übersicht“) — keine `TemporaryEncodingTest`-Komponente unter `apps/website` (Repo-Suche).

## Assets

- Ordner `apps/website/ui8/` vorhanden (u. a. Template-ZIPs); Root-`.gitignore` enthält `*.zip` (ZIPs werden nicht versioniert, sofern ignoriert).

## Duplikat / Legacy

- **`apps/website-old/`** — ältere Marketing-Site.
- **`apps/website-pre-v2-backup/`** — Backup mit eigenem `package.json` (`@resqbrain/website`), nicht in `pnpm-workspace.yaml`.
