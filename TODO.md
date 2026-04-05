# Repo Cleanup Plan

## 1. Aktive Struktur (kanonisch)

- **Aktive Website (Build-Ziel):** `apps/website`
  - Belegt durch Root-`vercel.json`:
    - `"rootDirectory": "apps/website"`
    - `"buildCommand": "pnpm --filter @resqbrain/website build"`
    - `"outputDirectory": "apps/website/.next"`
- **Aktiv genutzte Build-Pfade:**
  - Root `package.json`:
    - `"build": "pnpm --filter @resqbrain/website build"`
    - `"build:website": "pnpm --filter @resqbrain/website build"`
  - `apps/website/package.json`:
    - `"build": "next build"`
- **Greifende Deployment-Config:**
  - Root `vercel.json` steuert Build auf Repo-Ebene.
  - `apps/website/vercel.json` existiert zusätzlich, aber Root-Config setzt bereits explizit `rootDirectory`.
- **Aktive Website-Routen (Datei-basiert in `apps/website/app`):**
  - `/` (`app/page.tsx`)
  - `/kontakt`
  - `/links`
  - `/mitwirkung`
  - `/impressum`
  - `/datenschutz`
- **Aktive Landingpage-Struktur:**
  - `apps/website/app/page.tsx` rendert `HomePageSections`.
  - `apps/website/components/home/home-page-sections.tsx` rendert:
    - `HomeHero`
    - `SurveyInviteSection`
    - `ProblemBenefitsSection`
    - `FeaturesOverviewSection`
    - `AudiencesSection`
    - `PilotFeedbackSection`
    - `CollaborationSection`
    - `FaqSection`
- **CTA-/Umfrage-Link-Quelle (aktiv):**
  - `apps/website/components/links/survey-cta-link.tsx` nutzt zentral `resolveSurveyLink()`.
  - `apps/website/lib/routes.ts` leitet auf externe Umfrage-URL oder Fallback `/mitwirkung#umfrage`.
  - `apps/website/lib/public-config.ts` enthält aktive URL `https://forms.cloud.microsoft/r/ZFVgC0L1BZ`.

## 2. Legacy / Altstruktur

- `apps/website-old/`
  - Eigene Next-Struktur (`app/`, `components/`, `sections/`, `package.json`, `vercel.json`).
  - Eigene Scripts (`phase11:website`, `validate:routing`, `validate:isolation`).
  - `vercel.json` mit `ignoreCommand` auf `scripts/vercel-ignore.js`.
- Root `app/` + Root `components/`
  - Vollständige zweite Website-Struktur außerhalb `apps/website`.
  - `app/page.tsx` rendert alte Section-Kette (`HeroSection`, `ProblemSection`, `SolutionSection`, `FeaturesSection`, `SurveysSection`, `UseCasesSection`, `StatusSection`, `CtaSection`, `FooterSection`).
  - `components/layout/*` und `components/sections/*` werden dort verwendet.
- Weitere doppelte Website-Strukturen:
  - `apps/website/components/sections/*` (aktive Struktur)
  - `apps/website-old/components/sections/*` (alte Struktur)
  - `apps/website-old/sections/*` (zusätzliche Duplikat-Ebene im alten Website-Baum)

## 3. Validierungsprobleme

- Zielskripte:
  - `scripts/validate-routing.ts`
  - `scripts/validate-content-isolation.ts`
- **Technischer Ausführungsstatus im aktuellen Workspace:**
  - `pnpm exec tsx scripts/validate-routing.ts` → **FAIL** (`Command "tsx" not found`)
  - `pnpm exec tsx scripts/validate-content-isolation.ts` → **FAIL** (`Command "tsx" not found`)
  - Grund: lokale Dependencies aktuell nicht installiert/verfügbar.
- **Inhaltlicher Status der Skripte (Datei-basiert):**
  - Beide Skripte prüfen explizit auf `apps/website`-Pfade und Routen `/`, `/kontakt`, `/links`, `/mitwirkung`, `/impressum`, `/datenschutz`.
  - `validate-content-isolation.ts` erwartet app-level `apps/website/vercel.json` (Check `Root = apps/website`), obwohl zusätzlich ein Root-`vercel.json` existiert.
- **Bindung im Projekt:**
  - Root `package.json` referenziert die beiden Validierungsskripte nicht in `build`.
  - `apps/website-old/package.json` referenziert beide Skripte weiterhin (`phase11:website`).

## 4. Risiken

- **Build-Risiken**
  - Zwei ausführbare Website-Projekte im Workspace (`apps/website`, `apps/website-old`) mit eigenen `package.json`/Build-Skripten.
  - Zusätzliche Root-Website-Struktur (`/app`, `/components`) erhöht Verwechslungsrisiko bei Änderungen.
  - Validierungsskripte sind nicht im aktiven Root-Build verankert.

- **Routing-Risiken**
  - Drei parallele Routing-/Section-Modelle (active website, website-old, root app).
  - Höheres Risiko für inkonsistente Navigation/CTA-Links bei Änderungen.

- **Deployment-Risiken**
  - Mehrere Vercel-Konfigurationen (`/vercel.json`, `apps/website/vercel.json`, `apps/website-old/vercel.json`).
  - `apps/website-old/vercel.json` hat branchabhängiges Ignore-Verhalten via `scripts/vercel-ignore.js`.

- **Wartbarkeitsrisiken**
  - Doppelte und teils dreifache Komponenten-/Section-Strukturen.
  - Hohe Kontextkosten für Contributor (unklar, welche Struktur „Source of Truth“ ist).

- **Dokumentation-vs-Code-Inkonsistenzen**
  - `CLAUDE.md` enthält Aussagen „mobile app not yet implemented“, „packages/domain not yet implemented“, „No build, test, or lint commands are configured yet“.
  - Repository enthält jedoch:
    - `apps/mobile-app/` mit umfangreicher Codebasis,
    - `packages/domain/` mit Source + Test-/Compile-Skripten,
    - Build-/Test-/Verify-Skripte in mehreren `package.json`.

## 5. Cleanup Reihenfolge

### Phase 0 — Safe
- Aktive Pfade/Build-Quelle schriftlich fixieren (`apps/website`, Root-`vercel.json`, Root-Buildscript).
- Legacy-Bäume eindeutig labeln (nur Klassifikation, keine Löschung).

### Phase 1 — Validation Fix
- Validierungsskripte auf aktiven Build-Pfad und gewünschte CI-Bindung abstimmen.
- Entscheidung dokumentieren: laufen diese Checks für `apps/website` oder nur für Legacy.

### Phase 2 — Legacy Isolation
- `apps/website-old` und Root-Website-Struktur (`/app`, `/components`) klar als legacy markieren.
- Legacy-Pfade aus aktiven Build-/Release-Dokumenten entkoppeln.

### Phase 3 — Struktur Cleanup
- Doppelte Website-Artefakte konsolidieren (nach finaler Freigabe).
- Redundante Konfigurationsdateien reduzieren (eine eindeutige Deployment-Quelle).

### Phase 4 — Docs Sync
- Architektur-/Setup-Dokumente an tatsächlichen Repository-Stand angleichen.
- Canonical-Doku und operative Build-Realität synchronisieren.

## 6. Konkrete Datei Aktionen

| Pfad | Aktion | Grund |
|---|---|---|
| `/vercel.json` | keep | Definiert aktiv RootDirectory `apps/website` + Build-Command. |
| `/apps/website/` | keep | Aktive Website-Struktur und Build-Ziel. |
| `/apps/website/vercel.json` | update | Rolle gegenüber Root-`vercel.json` explizit dokumentieren oder konsolidieren. |
| `/apps/website-old/` | archive | Vollständige Legacy-Website mit eigener Build-/Vercel-Konfiguration. |
| `/apps/website-old/vercel.json` | archive | Legacy-Ignore-Mechanismus (`vercel-ignore.js`) nur dort referenziert. |
| `/app/` | archive | Zweite Root-Website-Struktur, parallel zur aktiven `apps/website`. |
| `/components/` | archive | Gehört zur Root-Altstruktur, parallel zu `apps/website/components`. |
| `/scripts/validate-routing.ts` | update | Klare Bindung an aktives Ziel + CI-Einbindung präzisieren. |
| `/scripts/validate-content-isolation.ts` | update | Root-vs-app Vercel-Annahme explizit machen; Build-Realität abgleichen. |
| `/scripts/vercel-ignore.js` | archive | Derzeit durch `apps/website-old/vercel.json` genutzt (Legacy-Kontext). |
| `/CLAUDE.md` | update | Enthält mehrere Aussagen, die nicht mehr zum aktuellen Repo-Stand passen. |
| `/docs/context/` | update | Canonical Doku an aktive Struktur/Buildpfade anpassen. |
| `/docs/architecture/` | update | Struktur- und Modulbeschreibung auf tatsächliche Repo-Lage abstimmen. |
| `/packages/domain/.codex-versioning-test-build/` | archive | Build-Artefakt-/Testoutput-Struktur parallel zu Source (Bereinigungskandidat). |

> Hinweis: `delete` wurde bewusst nicht eingeplant; zunächst nur keep/update/move/archive gemäß Analyseauftrag.

## 7. Empfohlener nächster Schritt

1. **Aktive Website formal fixieren:** In Doku + CI eindeutig festlegen, dass `apps/website` der einzige aktive Web-Build ist.
2. **Validierungen lauffähig machen:** Dependencies installieren und beide Skripte einmal im aktuellen Setup ausführen; Ergebnisse protokollieren.
3. **Legacy markieren:** `apps/website-old`, Root `app/`, Root `components/` mit eindeutiger Legacy-Kennzeichnung versehen (ohne Entfernen).
4. **Deployment-Konfiguration entflechten:** Verantwortlichkeit von Root-`vercel.json` vs. App-/Legacy-`vercel.json` klarziehen.
5. **Dokumentation synchronisieren:** `CLAUDE.md` + relevante `docs/context`/`docs/architecture` auf den realen Strukturstand aktualisieren.
