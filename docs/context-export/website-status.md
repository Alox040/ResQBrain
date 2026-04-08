# Website-Status (Export)

**Vorhanden:** `apps/website/` (Next.js App Router). Zusätzlich im Baum, nicht Workspace-Mitglied: `apps/website-old/`, `apps/website-pre-v2-backup/`, `apps/website-lab/` (Figma-Playground). **`apps/website-v2/`** im aktuellen Repo **nicht** vorhanden.

**Letzte Verifikation (Export):** `pnpm build` (Root) Exit 0, Next.js 16.2.1, **10** statische Seiten (8. April 2026). Live-Vercel-Status in diesem Lauf nicht per API/Dashboard geprüft.

**Design-Stand:** Figma-basiertes CSS-System und Komponentenbibliothek unter `components/`; Startseite nutzt komponierte Layout-Primitives statt direkter Section-Imports (siehe unten).

## Next.js-Struktur

- **`apps/website/app/layout.tsx`** — `SiteShell`, Schrift `Instrument_Sans` (`next/font/google`, Subsets `latin`, `latin-ext`), `lang="de"`.
- **`apps/website/app/globals.css`** — CSS-System (Figma-orientiert).
- **`apps/website/app/page.tsx`** — Startseite: `SectionFrame`/`Container`/`Stack`/`ContentCard`/`SectionHeading`/`ButtonLink`; Inhalte aus `content` (`@/lib/site/content`).
- **`apps/website/components/`** — `layout/`, `sections/` (Komponenten z. B. `HeroSection.tsx` existieren, werden von `app/page.tsx` aktuell nicht importiert), `ui/`.
- **`package.json`:** `next ^16.2.1` (Build: Next.js **16.2.1** mit Turbopack).

## Komponentenstruktur (Auszug)

### `apps/website/components/layout/`
`site-shell.tsx`, `site-header.tsx`, `site-footer.tsx`, `footer-nav.tsx`, `main-nav.tsx`, `Section.tsx`, `Container.tsx`, `Stack.tsx`

### `apps/website/components/sections/`
`HeroSection.tsx`, `ProblemSection.tsx`, `IdeaSection.tsx`, `StatusSection.tsx`, `AudienceSection.tsx`, `MitwirkungSection.tsx`, `FaqSection.tsx`, `ContactCtaSection.tsx`, `ProjectGoalSection.tsx`

### `apps/website/components/ui/`
`badge.tsx`, `button-link.tsx`, `card-title.tsx`, `container.tsx`, `content-card.tsx`, `page-header.tsx`, `section-frame.tsx`, `section-heading.tsx`, `stack.tsx`, `text-link.tsx`

## Startseite (inhaltliche Blöcke)

Reihenfolge und Texte aus `apps/website/lib/site/content.ts`, gerendert in `app/page.tsx` als aufeinanderfolgende `SectionFrame`-Abschnitte u. a. für: Hero (+ eingebetteter Mitwirkungs-/Status-Kartenbereich), Problem, Idea + Projektziel (Split), Status, Audience, Mitwirkung, FAQ, Abschluss-CTA.

## Routing

| Route | Datei | Build-Modus | Hinweis |
|-------|--------|-------------|---------|
| `/` | `app/page.tsx` | Static | Layout-Komposition, kein `*Section`-Import |
| `/kontakt` | `app/kontakt/page.tsx` | Static | |
| `/links` | `app/links/page.tsx` | Static | TikTok-optimiert |
| `/mitwirkung` | `app/mitwirkung/page.tsx` | Static | Umfrage-CTA |
| `/mitwirken` | `app/mitwirken/page.tsx` | Static | |
| `/updates` | `app/updates/page.tsx` | Static | Copy `updates-page.ts`, Formular-Link `updates-form.ts` |
| `/impressum` | `app/impressum/page.tsx` | Static | |
| `/datenschutz` | `app/datenschutz/page.tsx` | Static | |
| `/_not-found` | Framework | Static | |

Navigation: `apps/website/lib/routes.ts` — `routes`, `mainNav`, `footerNav`.

## Umfragen-Integration

- **`lib/site/survey.ts`:** Export `surveys` mit `active: { label, href, description, date }`; `href` zeigt auf **`https://forms.office.com/r/vzHuUdFBRy`** (Microsoft Forms), nicht auf einen generischen Platzhalter-Domain-Namen.
- **`lib/site/content.ts`** / **`lib/site/mitwirkung.ts`** / **`lib/site/links-page.ts`** beziehen sich auf Umfrage-Daten aus `./survey` bzw. `surveys`.
- **`app/mitwirkung/page.tsx`:** Umfrage-Abschnitt mit `ButtonLink` auf konfigurierte URLs aus Seiteninhalt.
- Kein Survey-Backend im Repository — externe Formular-URLs und statische Copy.

## Updates-Seite / zweites Formular

- **`lib/site/updates-form.ts`:** `updatesInterestFormHref` aus `NEXT_PUBLIC_UPDATES_FORM_URL` (wenn gesetzt und `http…`) sonst derselbe Microsoft-Forms-Link wie oben.
- **`lib/site/updates-page.ts`:** Texte und CTA für `/updates` (Hinweis: keine Registrierungslogik auf der Website).

## CTA / Buttons

- Hero (laut `content.hero`): primär **Mitwirken** (`routes.mitwirken`), sekundär **Projekt auf GitHub** (`https://github.com/Alox040/ResQBrain`, `external: true`).
- Mitwirkungsbereich auf der Startseite: Button mit `content.mitwirkung.cta` (u. a. `external`).
- Abschluss-CTA: `content.cta` mit `ButtonLink`.

## Deployment (Vercel, dateibasiert)

- **Repository-Root `vercel.json`:** `rootDirectory: "apps/website"`, `buildCommand` / `outputDirectory` auf diese App.
- **`apps/website/vercel.json`:** `framework`, `installCommand`, `buildCommand` — **ohne** `ignoreCommand`.
- **`apps/website-old/vercel.json`:** `ignoreCommand` → `node ../../scripts/vercel-ignore.js`.

## Encoding / Copy

- Layout-Kommentar zu UTF-8 / Charset-Meta (Next.js) in `app/layout.tsx`.
- Sichtbare deutsche Texte in `content.ts` und Seiten mit Umlauten — keine `TemporaryEncodingTest`-Komponente unter `apps/website` (Repo-Suche im Rahmen dieses Exports).

## Assets

- Ordner `apps/website/ui8/` vorhanden (u. a. Template-ZIPs); Root-`.gitignore` enthält `*.zip` (ZIPs werden nicht versioniert, sofern ignoriert).

## Duplikat / Legacy / Labs

- **`apps/website-old/`** — ältere Marketing-Site.
- **`apps/website-pre-v2-backup/`** — Backup mit eigenem `package.json` (`@resqbrain/website`), nicht in `pnpm-workspace.yaml`.
- **`apps/website-lab/`** — Isolierter Figma-Architektur-Playground (kein Workspace-Mitglied).
- **Root-Level-Struktur (`app/`, `components/`, `lib/`)** — Parallele Next.js-ähnliche Struktur am Repo-Root; kein Einfluss auf produktives Deployment (`vercel.json` zeigt auf `apps/website`).
