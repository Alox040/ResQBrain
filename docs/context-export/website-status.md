# Website-Status (`apps/website`)

**Stand:** 12. April 2026 — aus App-Router-Dateien, `lib/`, `vercel.json`, Root-`vercel.json`.

---

## Vorhanden

**Ja.** Deploy-Konfiguration: Root-`vercel.json` setzt `rootDirectory: "apps/website"` und `buildCommand: pnpm --filter @resqbrain/website build`.

---

## Next.js Struktur

- **App Router:** `apps/website/app/`
- **Konfiguration:** `apps/website/next.config.ts` (im Repo vorhanden; Inhalt hier nicht zeilenweise zitiert)
- **Globales Layout:** `app/layout.tsx`
- **Styling:** Tailwind (siehe `package.json`: `tailwindcss`, `@tailwindcss/postcss`)

---

## Sections / Seiten (App Router)

Aus dem Dateisystem `app/` (ohne `figma/`-Unterbaum):

| Route | Datei |
|-------|--------|
| `/` | `app/page.tsx` |
| `/impressum` | `app/impressum/page.tsx` |
| `/kontakt` | `app/kontakt/page.tsx` |
| `/links` | `app/links/page.tsx` |
| `/mitwirkung` | `app/mitwirkung/page.tsx` |
| `/mitwirken` | `app/mitwirken/page.tsx` |
| `/datenschutz` | `app/datenschutz/page.tsx` |
| `/updates` | `app/updates/page.tsx` |
| `/lab/lookup` | `app/lab/lookup/page.tsx` |
| 404 | `app/not-found.tsx` |

**Startseiten-Inhalt (`page.tsx`):** nutzt `content` aus `@/lib/site/content` — u. a. Hero (Badge, CTAs), Problem-, Idee-, Projektziel-, Status-, Zielgruppen-Sektionen (weitere Abschnitte unterhalb der gelesenen Zeilen nicht vollständig aufgelistet).

---

## Routing (Navigation)

**Datei:** `apps/website/lib/routes.ts`

- Routen-Konstanten: `/`, `/kontakt`, `/mitwirkung`, `/mitwirken`, `/links`, `/impressum`, `/datenschutz`, `/updates`
- **`mainNav`:** Start, Mitwirkung, Mitwirken, Updates, Links, Kontakt
- **`footerNav`:** Impressum, Datenschutz

---

## Umfragen-Integration

1. **`apps/website/lib/site/survey.ts`**  
   - Aktive Umfrage: Label „Aktuelle Umfrage“, URL `https://forms.office.com/r/vzHuUdFBRy`, Beschreibung „UI & UX Feedback“, Datum „April 2026“.  
   - `previous: []` (leer).

2. **`docs/context/website-config.json`** (Konfigurationsdatei, nicht identisch mit `survey.ts`):  
   - Einträge unter `surveys.active` / `surveys.completed` mit **anderen** URLs (`forms.cloud.microsoft/...`).  
   **Hinweis für externe Analyse:** Zwei unterschiedliche Quellen für Umfrage-Links — welche im UI gebunden ist, erfordert Abgleich der Komponenten, die `survey.ts` bzw. die JSON-Datei importieren (nicht vollständig für diesen Export verfolgt).

---

## CTA Buttons

- **Hero:** Primär-Link aus `content.hero.ctaPrimary` → `routes.mitwirken` (`/mitwirken`); Sekundär extern zu GitHub-Repository-URL in `content.ts`.
- **Mitwirken-Seite:** Formular `MitwirkenForm` (siehe `app/mitwirken/page.tsx`).

---

## API (Formular)

- **`POST`** `apps/website/app/api/mitwirken/route.ts` — `runtime: "nodejs"`, Validierung über `@/lib/mitwirken/schema`, Rate-Limit, E-Mail-Versand über `@/lib/mitwirken/mail`.

---

## Deployment (Vercel)

- **Root `vercel.json`:** `framework: nextjs`, `installCommand: pnpm install`, `buildCommand` und `outputDirectory` auf Website-Paket ausgerichtet.
- **`apps/website/vercel.json`:** kürzere Variante mit `buildCommand: pnpm --filter @resqbrain/website build`.
- **Ignore-Logik:** `scripts/vercel-ignore.js` — Build wird für Branches **außer** `main`/`master` übersprungen (`process.exit(0)` vs `1`).

**Live-Deployment-URL:** in den geprüften Dateien nicht hinterlegt.

---

## Repo-Root `app/` (Abgrenzung)

Unter **`e:\Programmierung\ResQBrain\app\`** existiert ein weiteres App-Router-Layout (`layout.tsx`, `page.tsx`, u. a. `mitwirkung/page.tsx`). Am **Repo-Root** gibt es **kein** `next.config.*`; das konfigurierte Next-Projekt für Vercel ist **`apps/website`**. Die Root-`app/`-Struktur ist damit **nicht** Teil des in `vercel.json` referenzierten Website-Builds.

---

## Bekannte UI-Probleme

- In den geprüften Dateien **keine** explizite Liste von UI-Bugs — **nicht belegt**.

## Bekannte Encoding-Probleme

- **Nicht systematisch gescannt.**  
- Einzelbeleg: in `apps/mobile-app/src/lookup/loadLookupBundle.ts` Kommentarzeile mit Zeichenfolge `â€"` (typische UTF-8/Latin-1-Verlesung) — **Datei-basiert**, betrifft Kommentar, nicht zwingend UI.
