# Arbeitssession

## 14. April 2026 — Finale Build- & Routing-Validierung (Repo HEAD `366e843`)

**Art:** Validierungs-Agent — Build, Website-Typecheck, Mobile-Verify, Website-Routen/Footer/CTA (dateistrukturell), Mobile-Navigation (Skripte). Kein Produktcode in dieser Session geändert.

### Prüfpunkte (PASS / WARN / FAIL)

| # | Prüfpunkt | Status | Befund |
|---|-----------|--------|--------|
| 1 | Root Build (`pnpm build` → `@resqbrain/website` `next build`) | **PASS** | Exit 0; Next.js 16.2.1 (Turbopack); TypeScript-Phase im Build grün. |
| 2 | Website Typecheck (`pnpm --filter @resqbrain/website run typecheck`) | **PASS** | Exit 0; `tsc --noEmit` ohne Diagnosen. |
| 3 | Mobile Verify (`pnpm mobile:verify` → `verify:static` + `verify:expo-bundle`) | **PASS** | `verify:navigation` OK; `verify:nav-routes` OK; `expo export --platform android` → `dist-validation` OK. |
| 4 | Website-Routen `/impressum`, `/datenschutz`, CTA/Footer | **PASS** (dateibasiert) | `app/impressum/page.tsx`, `app/datenschutz/page.tsx`; Build-Route-Liste enthält `○ /impressum`, `○ /datenschutz`. `lib/routes.ts` + `lib/site/navigation.ts` `footerNavigation`: Impressum, Datenschutz, extern GitHub/Discord, Kontakt-Mailto. **Annahme:** Laufzeit-HTTP und Klickpfade im Browser in dieser Session nicht manuell verifiziert. |
| 5 | Navigation / Routen-Konfiguration (Mobile) | **PASS** (Skripte) | `node scripts/verify-navigation.mjs` und `verify-nav-routes.mjs` grün gegen `AppNavigator.tsx` / Param-Listen. **WARN:** Kein Geräte-/Simulator-Lauf. |

### Konkrete Befehle (ausgeführt)

```text
pnpm build
pnpm --filter @resqbrain/website run typecheck
pnpm mobile:verify
git rev-parse HEAD
```

### Konkrete Ergebnisse (Kurz)

- **Website-Build:** u. a. statische Routen `/`, `/impressum`, `/datenschutz`, `/kontakt`, `/mitwirken`, `/mitwirkung`, `/links`, `/updates`; dynamisch `/lab/lookup`, `/api/mitwirken`.
- **Mobile:** Typecheck + Nav-Checks + Android-Export-Bundle erfolgreich.

### Restwarnungen / Hinweise

- **WARN:** Website- und Mobile-Routen hier **strukturell** und per **Build/Skript** bestätigt — kein E2E-Browser-Test, kein iOS-Export in `mobile:verify` (nur Android laut `verify:expo-bundle`).
- **WARN:** `pnpm mobile:verify` enthält kein `expo-doctor` (separat: `pnpm mobile:verify:doctor`).

### Abschlussstatus

**PASS** — für den definierten Gate (Root-Build, Website-`tsc`, `mobile:verify` inkl. Expo-Export Android, dateibasierte Legal-/Footer-Konsistenz, Mobile-Nav-Skripte). Keine FAIL-Stufen.

---

## 15. April 2026 — Doku-Abgleich README / Status (Repo HEAD `afe338e`)

**Art:** Statusdateien und README gegen Ist-Code abgleichen (kein Feature-Code geändert).

### Verifiziert (lokal, diese Session)

| Prüfung | Ergebnis |
|---------|----------|
| `pnpm --filter @resqbrain/domain exec tsc -p tsconfig.json --noEmit` | ✓ |
| `pnpm --filter @resqbrain/domain run compile:versioning` | ✓ |
| `pnpm --filter @resqbrain/domain run compile:release` | ✓ |
| `pnpm build` (Next.js 16.2.1) | ✓ — 12 Routen inkl. `/api/mitwirken`, `/lab/lookup` (ƒ) |
| `pnpm --filter @resqbrain/website run typecheck` | ✓ |
| `pnpm mobile:verify` | ✓ |

### Inhaltliche Korrekturen (Kurz)

- Mobile: persistiertes Lookup-Bundle in **AsyncStorage** (`lookupCache.ts`); Start über `loadLookupBundleWithSource`; optional **HTTP-Bundle-Update** bei `EXPO_PUBLIC_LOOKUP_BUNDLE_URL` (`App.tsx` / `bundleUpdateService.ts`). Frühere Formulierungen „nur embedded / kein Geräte-Bundle“ sind damit überholt.
- Navigation: **fünf** Root-Tabs inkl. **Einstellungen**; Favoriten/Verlauf **nicht** als eigene Root-Tabs.
- Website: dynamische Routen `/lab/lookup`, `/api/mitwirken` im Build sichtbar.

Ältere Session-Einträge unten unverändert als Archiv; bei Widerspruch gilt dieser Abgleich-Stand.

---

**Datum (Archiv unten):** 9. April 2026  
**Art:** Arbeitstages-Abschluss — Domain-Release-Modul, TS-Barrel-/Lifecycle-Bereinigung, vollständige Build-Validierung, Status-/README-Sync

## EOD — Validierung & Docs-Sync (zweiter Lauf, 9. April 2026)

### Repo-Stand (Start dieses Laufs)

- **HEAD:** `b491609` — *add internal lookup lab page for local runtime testing*
- **Working tree:** leer (vor diesem Dokumentations-Commit)

### Ergänzung zum Tagesstand (Lookup-Lab)

| Bereich | Inhalt |
|---------|--------|
| Website | Route **`/lab/lookup`** (`apps/website/app/lab/lookup/page.tsx`) — **dynamisch (ƒ)**; lokale Runtime-Tests gegen Lookup-API; **nicht** in Hauptnavigation oder Footer verlinkt |

### Validierung (dieser Lauf)

| Prüfung | Ergebnis |
|---------|----------|
| `pnpm --filter @resqbrain/domain exec tsc -p tsconfig.json --noEmit` | ✓ |
| `pnpm --filter @resqbrain/domain run compile:versioning` | ✓ |
| `pnpm build` | ✓ — Next.js 16.2.1 |
| `pnpm --filter @resqbrain/website run typecheck` | ✓ |

### Website — Routing / Links (Stichprobe)

- **`/`**, **`/impressum`**, **`/datenschutz`:** jeweils `app/.../page.tsx` vorhanden; Build + `tsc` ohne Importfehler.
- **Footer** (`components/layout/footer-nav.tsx` → `lib/site/navigation.ts` → `footerNavigation`): Impressum, Datenschutz (`routes.impressum` / `routes.datenschutz`); extern GitHub, Discord, Kontakt-Mailto.
- **CTAs:** Hero Primary → `routes.mitwirken`; Mitwirkungsblock auf `/` nutzt `content.mitwirkung.cta.href` → `surveys.active.href` (`lib/site/survey.ts`); Abschluss-CTA → `routes.kontakt`.
- **Umfrage / „SurveysSection“:** Keine Komponente dieses Namens auf der Startseite; Umfrage über **`content.mitwirkung`** (Home) und **`mitwirkungPageContent`** (`lib/site/mitwirkung` → `survey.ts`); `/links` verweist ebenfalls auf `surveys.active.href`.
- **Fragment-Anker auf `/`:** weiterhin keine Sektions-`id`s — keine internen `#…`-Navigation auf der Landingpage.

**Hinweis:** Im Domain-`tsconfig.json` zeigt `typeRoots` auf `apps/website/node_modules/@types` (Tooling-Kopplung für `@types/node`); **keine** Domain-Source-Imports aus der Website.

---

## Was heute umgesetzt wurde (9. April 2026)

### Domain (`@resqbrain/domain`)

| Bereich | Änderung |
|---------|----------|
| `packages/domain/src/release/` | Neues Release-Subsystem: `ReleaseBundle`, semantische Release-Version, `ReleaseEngine`, domain-spezifische Fehlerklassen; `package.json`-Script `compile:release` |
| `packages/domain/src/index.ts` | Exporte für `./release/entities`, `./release/services`, `./release/errors` |
| `packages/domain/tsconfig.json` | `exclude: ["src/**/*.test.ts"]` — Root-`tsc --noEmit` prüft Produktionscode ohne Testdateien |
| `packages/domain/src/lifecycle/entities/ContentLifecycle.ts` | `ContentEntityType` nur noch aus `versioning/entities/EntityType` (kein doppeltes `CONTENT_ENTITY_TYPES` am Lifecycle-Barrel) |
| `packages/domain/src/lifecycle/services/ContentLifecycleService.ts` | Typ `Permission` umbenannt in `LifecyclePermissionKey` (Konflikt mit Governance-`Permission` am Root-Barrel vermieden) |

### Dokumentation / Repo-Hygiene

| Bereich | Änderung |
|---------|----------|
| `docs/status/PROJECT_STATUS.md` | Stand und Validierungsergebnisse 9. Apr. 2026 |
| `docs/status/WORK_SESSION.md` | Diese Session |
| `docs/roadmap/PROJECT_ROADMAP.md` | Validierungsfußzeile, Release-Hinweis |
| `README.md` | Current Status, Build Status, Website Status, Risiken — Datum 9. Apr. 2026 |

## Validierungen (9. April 2026)

| Prüfung | Ergebnis |
|---------|----------|
| `pnpm --filter @resqbrain/domain exec tsc -p tsconfig.json --noEmit` | ✓ |
| `pnpm --filter @resqbrain/domain run compile:versioning` | ✓ |
| `pnpm --filter @resqbrain/domain run compile:release` | ✓ |
| `pnpm build` (Next.js 16.2.1) | ✓ — inkl. `/`, `/impressum`, `/datenschutz`, `/lab/lookup` (siehe EOD-Lauf oben) |
| Website-Routing / Footer / Umfrage-CTAs | ✓ Dateien und `href` konsistent (`lib/site/navigation.ts`, `content.ts`, `mitwirkung.ts`, `links/page.tsx` → `survey.ts`) |
| `tsx --test src/lifecycle/lifecycle.engine.test.ts` | ✓ (Stichprobe nach Lifecycle-Typumbenennung) |
| TODO/FIXME/WIP in `apps/**/*.ts(x)`, `packages/**/*.ts(x)` | Keine Treffer (außer Union-Literal in `scripts/status/types.ts`) |

**Hinweis:** Domain-**Testdateien** sind von Root-`tsc` ausgeschlossen; einzelne Content-Tests erwarten noch `createAlgorithm` / Graph-Modell — bei Bedarf `pnpm --filter @resqbrain/domain run test:content` separat adressieren.

## Risiken / Hinweise

- Root-Level-`app/`/`components/`/`lib/` am Monorepo-Root weiterhin unklar (siehe Archiv 8. Apr.).
- Office-Forms-Umfrage-URL: Datenschutz/AV-Vertrag bei Produktion prüfen.
- Domain-Tests vs. vereinfachtes `Algorithm`-Entity (`steps: string`): Modell und Tests angleichen oder Tests anpassen.

## Nächste sinnvolle Schritte (Priorität)

1. **Content-Tests / Algorithm-Factory:** `createAlgorithm` und Invarianten-Tests an aktuelles Entity-Modell anbinden oder Modell erweitern.  
2. **Release-Modul:** Integrationstests (`compile:release` grün); Abgrenzung zu `src/legacy/release/` dokumentieren.  
3. **Bundle-Persistenz-Konzept** (`lookupSource`) — siehe Roadmap.  
4. **Root-Struktur** bereinigen oder formalisieren.  
5. **`pnpm mobile:verify`** vor nächsten Mobile-Änderungen.

---

## Session 8. April 2026 (Archiv)

**Datum:** 8. April 2026  
**Art:** Arbeitstages-Abschluss — Website-Figma-Migration abgeschlossen und deployed; Dokumentationsabgleich

### Website — Figma-Migration Phase 1 (abgeschlossen)

| Bereich | Änderung |
|---------|----------|
| `apps/website/app/globals.css` | Komplettes CSS-Redesign auf Figma-Basis (+150 Zeilen) |
| `apps/website/components/` | Neue Komponentenstruktur: `layout/`, `sections/`, `ui/` |
| `apps/website/components/sections/` | 9 Sections: Hero, Problem, Idea, Status, Audience, Mitwirkung, Faq, ContactCta, ProjectGoal |
| `apps/website/components/layout/` | site-shell, site-header, site-footer, footer-nav, main-nav, Section, Container, Stack |
| `apps/website/components/ui/` | badge, button-link, card-title, container, content-card, page-header, section-frame, section-heading, stack, text-link |
| `apps/website/app/mitwirken/` | Neue Route `/mitwirken` (Anmeldeseite) |
| `apps/website/app/updates/` | Neue Route `/updates` |
| `apps/website/app/links/links-bio.module.css` | CSS-Aktualisierung |
| `apps/website/figma/` | Figma-Export als Referenz im Repo |
| `apps/website-lab/` | Isolierter Figma-Architektur-Playground |
| `apps/mobile-app-lab/figma-export/` | Mobile-Figma-Export-Referenz |

### Root-Level-Struktur (beobachtet, zu klären)

Im Repo-Root existiert jetzt eine parallele Next.js-ähnliche Struktur:
- `app/` mit identischen Routen (datenschutz, impressum, kontakt, links, mitwirken, mitwirkung + layout.tsx + theme.css)
- `components/` mit cards, layout, sections, ui
- `lib/` mit routes.ts und site/

**Unklar:** Ist diese Root-Struktur bewusst (zukünftiges Website-v2-Setup) oder ein Artefakt (Befehle im falschen Verzeichnis ausgeführt)?  
**Kein Einfluss auf produktives Deployment** — Vercel nutzt `rootDirectory: "apps/website"`.

### Deployment (8. Apr.)

- Alle Website-Commits deployed auf Vercel (`final figma website deploy` — `b9a4093`)

### Validierungen (8. April 2026) — Archiv

| Prüfung | Ergebnis |
|---------|----------|
| Git-Status | ✓ Clean (keine uncommitted changes) |
| Letzter `pnpm build` (7. Apr.) | ✓ Next.js 16.2.1, 8 statische Seiten |
| Domain-`tsc --noEmit` (7. Apr.) | ✓ erfolgreich |
| Deployment | ✓ auf Vercel deployed (b9a4093) |

---

## Session 7. April 2026 (Archiv)

**Datum:** 7. April 2026  
**Art:** Arbeitstages-Abschluss — Workspace-Analyse, Domain-/Website-Validierung, `pnpm build`, Status- und README-Abgleich, Git-Sync

## Validierungen (7. April 2026)

### Workspace / Git

| Prüfung | Ergebnis |
|---------|----------|
| Geänderte Dateien (vor Commit) | `packages/domain/src/audit/audit.foundation.test.ts` (`regionId: null` im Release-Audit-Fixture); `apps/website/next-env.d.ts` (Next: `./.next/types/routes.d.ts` nach Produktionsbuild); `apps/website/tsconfig.tsbuildinfo` |
| TODO / FIXME / WIP in `.ts` / `.tsx` unter `apps/`, `packages/` | Keine Treffer |

### Domain

| Modul | Befehl | Ergebnis |
|-------|--------|----------|
| Gesamtpaket | `pnpm --filter @resqbrain/domain exec tsc -p tsconfig.json --noEmit` | ✓ erfolgreich |
| Content | `compile:content` | ✓ erfolgreich |
| Versioning | `compile:versioning` | ✓ erfolgreich |
| Governance | `compile:governance` | ✓ erfolgreich |

**Hinweis:** Vollpaket-`tsc` war zuvor an fehlendem `regionId` im Release-`AuditRecordEvent`-Fixture in `audit.foundation.test.ts` gescheitert — behoben.

**Exports:** `packages/domain/src/index.ts` — unverändert strukturell konsistent.

**Layering:** Keine Imports aus `apps/*` im Domain-Paket (manuelle Erwartung; nicht erneut per Skript belegt).

### Website / Routing

| Route | Datei | Status |
|-------|-------|--------|
| `/` | `apps/website/app/page.tsx` | ✓ Static |
| `/impressum` | `apps/website/app/impressum/page.tsx` | ✓ Static |
| `/datenschutz` | `apps/website/app/datenschutz/page.tsx` | ✓ Static |
| `/kontakt` | `apps/website/app/kontakt/page.tsx` | ✓ Static |
| `/links` | `apps/website/app/links/page.tsx` | ✓ Static |
| `/mitwirkung` | `apps/website/app/mitwirkung/page.tsx` | ✓ Static |
| `/_not-found` | — | ✓ Static |

**Navigation:** `lib/site/navigation.ts` — Footer verweist auf `routes.*` (Mitwirkung, Kontakt, Impressum, Datenschutz, Links).

**Umfrage / CTAs:** `lib/site/survey.ts` — aktive URL `forms.office.com`; Verwendung in `content.ts` (Mitwirkung-CTA), `HeroSection`/`MitwirkungSection`-Metadaten, `/mitwirkung`, `/links`. Keine dedizierte `SurveysSection`-Komponente.

**Anker:** Homepage ohne Sektions-`id`; keine defekten internen `#`-Anker im geprüften Pfad.

### Build

| Befehl | Ergebnis |
|--------|----------|
| `pnpm build` (Root → `@resqbrain/website`) | ✓ Next.js 16.2.1, 8 statische Seiten |
| `pnpm --filter @resqbrain/website run typecheck` | ✓ |

### Spot-Check Tests

| Befehl | Ergebnis |
|--------|----------|
| `pnpm exec tsx --test src/audit/audit.foundation.test.ts` (in `packages/domain`) | ✓ 7/7 |

## Risiken / Hinweise (kurz)

- `next-env.d.ts` zeigt nach `next build` auf `./.next/types/routes.d.ts` (nicht `dev/types`) — bei reinem `next dev` kann Next die Referenz erneut anpassen.  
- Externe Umfrage: DPA/Privacy vor Go-Live mit `/datenschutz` abstimmen.

## Nächste sinnvolle Schritte (Priorität)

1. **Implementierung:** Bundle-Persistenz / `lookupSource` (Mobile) — Roadmap Phase 0.  
2. **Architektur:** API- und Auth-Grenze für Organization-Kontext.  
3. **Website:** Fragment-IDs nur bei Bedarf; veraltete Anker-Doku bereinigen.  
4. **Validierung:** Bei Mobile-Änderungen `pnpm mobile:verify`.

---

## Session 5. April 2026 (Archiv)

**Datum:** 5. April 2026  
**Art:** Arbeitstages-Abschluss — Workspace-Analyse, Domain-/Website-Validierung, `pnpm build`, Status- und README-Abgleich, Git-Sync

## Validierungen (5. April 2026)

### Workspace / Git

| Prüfung | Ergebnis |
|---------|----------|
| Geänderte Dateien | `apps/website/next-env.d.ts` (Next.js-Typreferenz, u. a. `./.next/dev/types/routes.d.ts`) |
| TODO / FIXME / WIP in `.ts` / `.tsx` unter Repo (ohne `docs/`) | Keine Treffer in Produktionscode |

### Domain

| Modul | Befehl | Ergebnis |
|-------|--------|----------|
| Gesamtpaket | `pnpm --filter @resqbrain/domain exec tsc -p tsconfig.json` | ✓ erfolgreich |
| Content | `compile:content` | ✓ erfolgreich |
| Versioning | `compile:versioning` | ✓ erfolgreich |
| Governance | `compile:governance` | ✓ erfolgreich |

**Exports:** `packages/domain/src/index.ts` — Barrel zu Shared, Common, Tenant, Content, Lifecycle, Governance, Versioning, Audit, Release, Survey, Lookup (strukturell konsistent; kein `build`-Script im Paket — Prüfung über `tsc`).

**Layering:** Keine Imports aus `apps/*` im Domain-Paket (Quercheck per Suche).

### Website / Routing

| Route | Datei | Status |
|-------|-------|--------|
| `/` | `apps/website/app/page.tsx` | ✓ Static |
| `/impressum` | `apps/website/app/impressum/page.tsx` | ✓ Static |
| `/datenschutz` | `apps/website/app/datenschutz/page.tsx` | ✓ Static |
| `/kontakt` | `apps/website/app/kontakt/page.tsx` | ✓ Static |
| `/links` | `apps/website/app/links/page.tsx` | ✓ Static |
| `/mitwirkung` | `apps/website/app/mitwirkung/page.tsx` | ✓ Static |
| `/_not-found` | — | ✓ Static |

**Navigation:** `lib/site/navigation.ts` — Footer: Mitwirkung, Kontakt, Impressum, Datenschutz, Links (alle `routes.*` aus `lib/routes.ts`).

**Umfrage / CTAs:** Zentrale URL in `lib/site/survey.ts` (`forms.cloud.microsoft`); Verwendung u. a. `lib/site/content.ts` (Mitwirkung-CTA), `app/mitwirkung/page.tsx`, `lib/site/links-page.ts`. Keine separate `SurveysSection`-Komponente — Inhalte über Sektionen + `survey`-Modul.

**Anker:** Homepage-Sektionen setzen derzeit **keine** `id`-Attribute auf `Section`; interne `#…`-Sprünge sind im aktuellen UI nicht genutzt. (Hinweis: ältere Doku mit `#mitmachen` / `#faq` ist gegenüber Ist-Code veraltet.)

### Build

| Befehl | Ergebnis |
|--------|----------|
| `pnpm build` (Root → `@resqbrain/website`) | ✓ Next.js 16.2.1, 8 statische Seiten |
| `pnpm --filter @resqbrain/website run typecheck` | ✓ |

## Risiken / Hinweise (kurz)

- `next-env.d.ts` verweist auf generierte Typen unter `.next/` — nach frischem Clone ggf. einmal `next dev` / `next build` ausführen, damit Typpfade vorhanden sind.  
- Mandantentrennung und produktive API/Auth weiterhin nicht End-to-End in der App abgesichert (Modell vs. Runtime).

## Nächste sinnvolle Schritte (Priorität)

1. **Implementierung:** `lookupSource` / Bundle-Persistenz (Mobile) — siehe Roadmap Phase 0.  
2. **Architektur:** API- und Auth-Grenze für Organization-Kontext skizzieren.  
3. **Website:** Fragment-IDs nur ergänzen, wenn echte In-Page-Sprünge gebraucht werden; Doku bereinigen.  
4. **Validierung:** Bei Mobile-Änderungen `pnpm mobile:verify`.

---

## Session 31. März 2026 (Archiv)

**Art:** Arbeitstages-Abschluss — Statusvalidierung, Build-Check, Routing-Prüfung, Dokumentationsabgleich

### Validierungen (31. März 2026)

#### Domain-Compile

| Modul | Befehl | Ergebnis |
|-------|--------|----------|
| Content | `compile:content` | ✓ erfolgreich |
| Versioning | `compile:versioning` | ✓ erfolgreich |
| Governance | `compile:governance` | ✓ erfolgreich |

#### Website-Build

| Prüfung | Ergebnis |
|---------|----------|
| `pnpm build:website` (Next.js 16 Turbopack) | ✓ erfolgreich |
| TypeScript-Check | ✓ keine Fehler |
| Statische Seiten (8/8) | ✓ vollständig generiert |

#### Routing

| Route | Status |
|-------|--------|
| `/` | ✓ Static |
| `/impressum` | ✓ Static |
| `/datenschutz` | ✓ Static |
| `/kontakt` | ✓ Static |
| `/links` | ✓ Static |
| `/mitwirkung` | ✓ Static |
| `/_not-found` | ✓ Static |

#### Codequalität

- Keine TODO/FIXME/WIP-Marker in Produktionscode (`.ts`, `.tsx`)
- Git-Workingcopy: sauber

### Offene Punkte (unverändert aus Phase-0)

- Lookup-Bundle separat auf Gerät speichern (Download/Sync)
- Netzwerk-Refresh / Sync-Engine
- Dosisrechner: nur heuristikbasiert (mg/µg-pro-kg im Freitext)
- Externe Umfrage-URLs: vor Go-Live inhaltlich und datenschutzrechtlich finalisieren

### Nächste sinnvolle Schritte (historisch)

#### Implementierung (Phase 0 Rest)
1. `lookupSource` erweitern: Bundle-Download und Gerätespeicherung
2. Sync-Konzept definieren: Trigger, Conflict-Resolution, Manifest-Vergleich

#### Architektur
3. API-Schicht planen: Organization-Kontext, Auth-Boundary, Tenant-Enforcement

#### Website
4. Umfrage-URLs produktiv setzen sobald Survey live

#### Validierung
5. `pnpm mobile:verify` bei nächster Mobile-Änderung ausführen

---

## Session 28. März 2026 (Archiv)

Website: Routing/Anker in Umfrage-bezogenen Sektionen und `FeatureVotingSection`; `scripts/validate-routing.ts`; README-Konfliktmarken bereinigt. Prüfungen damals: Domain-Compile, `validate:routing`, `pnpm build` — erfolgreich.

## Session 25. März 2026 (Kurz, Archiv)

Siehe frühere Einträge in Git-Historie / Roadmap.

## Offene Langfristpunkte (Plattform)

- Domain-Lifecycle-Services, Organization-Kontext in APIs, Content-Sourcing über MVP hinaus — siehe Architektur-Docs.

## Nächster dokumentierter Schritt (fortlaufend)

Bei Meilensteinen `PROJECT_STATUS.md` / `PROJECT_ROADMAP.md` nachziehen; diese Datei bei jeder Abschlusssession aktualisieren.
