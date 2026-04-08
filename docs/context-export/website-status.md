# Website-Status (Export)

**Vorhanden:** `apps/website/` (Next.js App Router). Zusätzlich im Baum, nicht Workspace-Mitglied: `apps/website-old/`, `apps/website-pre-v2-backup/`, `apps/website-lab/` (Figma-Playground). **`apps/website-v2/`** im aktuellen Repo **nicht** vorhanden.

**Letzte Verifikation (Export):** `pnpm build` (Root) Exit 0, Next.js 16.2.1 (7. April 2026). Website deployed auf Vercel (8. April 2026, `b9a4093`).

**Design-Stand:** Figma-Migration Phase 1 **abgeschlossen** (8. Apr. 2026) — neues CSS-System, neue Komponentenstruktur, zwei neue Routen.

## Next.js-Struktur

- **`apps/website/app/layout.tsx`** — `SiteShell`, Schrift `Instrument_Sans` (`next/font/google`, Subsets `latin`, `latin-ext`), `lang="de"`.
- **`apps/website/app/globals.css`** — Vollständig überarbeitetes CSS-System auf Figma-Basis (8. Apr. 2026).
- **`apps/website/app/page.tsx`** — Startseite: importiert und rendert die Section-Komponenten in fester Reihenfolge (siehe unten).
- **`apps/website/components/`** — Neue Komponentenstruktur durch Figma-Migration: `layout/`, `sections/`, `ui/`.
- **`package.json`:** `next ^16.2.1` (Build: Next.js **16.2.1** mit Turbopack).

## Komponentenstruktur (nach Figma-Migration)

### `apps/website/components/layout/`
`site-shell.tsx`, `site-header.tsx`, `site-footer.tsx`, `footer-nav.tsx`, `main-nav.tsx`, `Section.tsx`, `Container.tsx`, `Stack.tsx`

### `apps/website/components/sections/`
`HeroSection.tsx`, `ProblemSection.tsx`, `IdeaSection.tsx`, `StatusSection.tsx`, `AudienceSection.tsx`, `MitwirkungSection.tsx`, `FaqSection.tsx`, `ContactCtaSection.tsx`, `ProjectGoalSection.tsx`

### `apps/website/components/ui/`
`badge.tsx`, `button-link.tsx`, `card-title.tsx`, `container.tsx`, `content-card.tsx`, `page-header.tsx`, `section-frame.tsx`, `section-heading.tsx`, `stack.tsx`, `text-link.tsx`

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
9. `ProjectGoalSection`  

Inhalte primär aus `apps/website/lib/site/content.ts`.

## Routing

| Route | Datei | Build-Modus | Hinweis |
|-------|--------|-------------|---------|
| `/` | `app/page.tsx` | Static | 9 Sections |
| `/kontakt` | `app/kontakt/page.tsx` | Static | |
| `/links` | `app/links/page.tsx` | Static | TikTok-optimiert |
| `/mitwirkung` | `app/mitwirkung/page.tsx` | Static | Umfrage-CTA |
| `/mitwirken` | `app/mitwirken/page.tsx` | Static | Neu (8. Apr. 2026) |
| `/updates` | `app/updates/page.tsx` | Static | Neu (8. Apr. 2026) |
| `/impressum` | `app/impressum/page.tsx` | Static | |
| `/datenschutz` | `app/datenschutz/page.tsx` | Static | |
| `/_not-found` | Framework | Static | |

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

## Duplikat / Legacy / Labs

- **`apps/website-old/`** — ältere Marketing-Site.
- **`apps/website-pre-v2-backup/`** — Backup mit eigenem `package.json` (`@resqbrain/website`), nicht in `pnpm-workspace.yaml`.
- **`apps/website-lab/`** — Isolierter Figma-Architektur-Playground (kein Workspace-Mitglied); enthält `apps/website-lab/figma/` als Figma-Export-Referenz.
- **Root-Level-Struktur (`app/`, `components/`, `lib/`)** — Parallele Next.js-ähnliche Struktur am Repo-Root; Zweck unklar (v2-Vorbereitung oder Artefakt). Kein Einfluss auf produktives Deployment (`vercel.json` zeigt auf `apps/website`).
