# Arbeitssession

**Datum:** 8. April 2026  
**Art:** Arbeitstages-Abschluss — Website-Figma-Migration abgeschlossen und deployed; Dokumentationsabgleich

## Was heute umgesetzt wurde (8. April 2026)

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

### Deployment

- Alle Website-Commits deployed auf Vercel (`final figma website deploy` — `b9a4093`)
- Git-Status: sauber, Branch `main` up-to-date

## Validierungen (8. April 2026)

| Prüfung | Ergebnis |
|---------|----------|
| Git-Status | ✓ Clean (keine uncommitted changes) |
| Letzter `pnpm build` (7. Apr.) | ✓ Next.js 16.2.1, 8 statische Seiten |
| Domain-`tsc --noEmit` (7. Apr.) | ✓ erfolgreich |
| Deployment | ✓ auf Vercel deployed (b9a4093) |

**Hinweis:** Kein neuer lokaler Build-Lauf heute — letzter valider Build war 7. Apr. 2026.

## Risiken / Hinweise

- Root-Level-`app/`/`components/`/`lib/`-Struktur: Zweck und Lebenszyklus klären — ggf. in `apps/website/` verschieben oder als `website-v2` separieren.
- `apps/website/app/mitwirken/page.tsx` existiert jetzt neben `/mitwirkung` — inhaltliche Abgrenzung dokumentieren.
- `/updates`-Route vorhanden — Inhalt und Datenpfad noch zu klären.

## Nächste sinnvolle Schritte (Priorität)

1. **Bundle-Persistenz — Konzept:** `docs/context/bundle-persistence-concept.md` anlegen (lookupSource-Erweiterung)
2. **Root-Struktur klären:** `app/`, `components/`, `lib/` am Root bereinigen oder formalisieren
3. **`/mitwirken` vs. `/mitwirkung`:** Inhaltliche Abgrenzung dokumentieren
4. **Sync-Konzept** (inhaltlich, als Dokument)
5. **Mobile `pnpm mobile:verify`** — vor nächsten Mobile-Änderungen sicherstellen

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
