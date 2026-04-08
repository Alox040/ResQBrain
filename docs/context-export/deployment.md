# Deployment & Build (Export)

**Letzte Verifikation (Export):** 8. April 2026.  
- **Domain `tsc --noEmit`:** 7. Apr. 2026 — Exit 0 (alle Module).  
- **`pnpm build` (Root):** 7. Apr. 2026 — Exit 0, Next.js 16.2.1, 8 statische Seiten.  
- **Website deployed auf Vercel:** 8. Apr. 2026 — Figma-Migration Phase 1 (`b9a4093 final figma website deploy`).  
- **`pnpm mobile:verify`:** Nicht grün — Mobile `tsc --noEmit` Exit 2 (unverändert seit 5. Apr.).

## Aktueller Deploy-Status (8. April 2026)

| Komponente | Status |
|-----------|--------|
| Website (Vercel, Produktion) | ✓ Deployed — Figma-Migration Phase 1 |
| Letzter Commit deployed | `b9a4093 final figma website deploy` |
| Neue Routen live | `/mitwirken`, `/updates` (zusätzlich zu bisherigen 6 Routen) |
| Mobile App | Nicht deployed — separater Expo-Build-Prozess |
| Domain-Paket | Nicht deployed — Library, kein eigenständiger Build |

## Vercel (aktive Website)

- **Repository-Root:** `vercel.json` — `framework: "nextjs"`, `rootDirectory: "apps/website"`, `installCommand: "pnpm install"`, `buildCommand: "pnpm --filter @resqbrain/website build"`, `outputDirectory: "apps/website/.next"`.
- **App-Ordner:** `apps/website/vercel.json` — `framework`, `installCommand`, `buildCommand` (kein `rootDirectory`, kein `ignoreCommand`).
- **`apps/website-v2/`:** im aktuellen Repository **nicht** vorhanden; Root-Level `app/`/`components/`/`lib/` ist kein eigenständiges Vercel-Projekt.

## Vercel (Legacy-Kopie)

- **`apps/website-old/vercel.json`:** `ignoreCommand` → `node ../../scripts/vercel-ignore.js`.
- **`scripts/vercel-ignore.js`:** Exit **0** = Build ignorieren, wenn `VERCEL_GIT_COMMIT_REF` nicht in `{main, master}`; Exit **1** = Build nicht ignorieren. Kommentar: Ignore Step vor Dependency-Install.

## Expo (Mobile)

- **Projekt:** `apps/mobile-app/`.
- **`app.json`:** Expo-Metadaten (Name, Slug, Icons, Splash).
- **`metro.config.js`:** `watchFolders` enthält Monorepo-Root, damit Imports aus `data/lookup-seed/` aufgelöst werden können.

## Build-Befehle (aus `package.json`)

| Ort | Befehl | Wirkung |
|-----|--------|---------|
| Repo-Root | `pnpm build` | `pnpm --filter @resqbrain/website build` → `next build` |
| Repo-Root | `pnpm build:website` | identisch zu `build` |
| Repo-Root | `pnpm render:website-status` | `tsx scripts/status/render-website-status.ts` |
| Repo-Root | `pnpm mobile:verify` | `pnpm --filter resqbrain-mobile run verify:local` — bricht aktuell an `tsc --noEmit` ab (Exit 2) |
| Repo-Root | `pnpm mobile:verify:doctor` | `pnpm --filter resqbrain-mobile run verify:expo-doctor` |
| Repo-Root | `pnpm dbrd:normalize` / `dbrd:normalize:medications` / `dbrd:normalize:algorithms` | `tsx scripts/dbrd/index.ts` (Teilmengen) |
| Repo-Root | `pnpm dbrd:validate-normalized` | DBRD-Normalisierung validieren |
| Repo-Root | `pnpm dbrd:build-lookup-seed` | Lookup-Seed aus Pipeline erzeugen |
| Repo-Root | `pnpm dbrd:build` | `validate-normalized` + `build-lookup-seed` |
| `apps/website` | `pnpm dev` / `build` / `start` / `typecheck` | Next.js / tsc |
| `apps/website-old` | `pnpm run phase11:website` | laut `apps/website-old/package.json` (Validierung + Build dieser Kopie) |
| `apps/mobile-app` | `pnpm start` | `expo start` |
| `apps/mobile-app` | `pnpm run export:android` / `export:ios` | `expo export` → `dist-validation` / `dist-validation-ios` |
| `packages/domain` | `compile:*`, `test:*` | Mehrere `tsc`-Projekte und `tsx --test` |

## Scripts (Auswahl, `scripts/`)

- `dbrd/` — Normalisierung, Seed-Build, Validierung (siehe `scripts/dbrd/README.md`).
- `vercel-ignore.js` — primär relevant für `website-old` (siehe oben).
- `validate-routing.ts`, `validate-content-isolation.ts` — **nicht** in `apps/website/package.json` verdrahtet; Aufruf per `pnpm exec tsx` vom Repo-Root.
- Zusätzliche Hilfsskripte (ohne Root-`package.json`-Eintrag): u. a. `validate-algorithms.ts`, `import-dbrd.ts`, `transform-algorithms.ts`, `cleanup-algorithms.ts`.
- `status/` — Render- und Sammelskripte für Statusdokumente.
- `check-german-umlauts.ts`.

## CI / Pipeline (Repo)

- Keine Workflow-Dateien unter `.github/workflows/` und keine `.gitlab-ci*.yml` (Suche Stand Export).

## Ignore Steps (Zusammenfassung)

- **Vercel:** Branch-Whitelist nur wenn `ignoreCommand` gesetzt — für **`apps/website`** in-repo **nicht** gesetzt; für **`apps/website-old`** gesetzt.

## Verifizierte lokale Läufe

### 7. April 2026

- **`pnpm --filter @resqbrain/domain exec tsc -p tsconfig.json --noEmit`:** Exit **0** — Domain-Gesamtpaket sauber.
- **`compile:content`, `compile:versioning`, `compile:governance`:** alle Exit **0**.
- **`pnpm build` (Root):** Exit 0, Next.js 16.2.1 (Turbopack).
- **`pnpm --filter @resqbrain/website run typecheck`:** Exit **0**.
- **`tsx --test src/audit/audit.foundation.test.ts`** (in `packages/domain`): 7/7 Tests bestanden.

### 5. April 2026 (Archiv)

- **`pnpm build` (Root):** Exit 0, Next.js 16.2.1 (Turbopack), 8 statische Seiten.
- **`npx tsc --noEmit` (`apps/mobile-app`):** Exit **2** — `ResolvedLookupBundle` ohne Property `version` in `App.tsx`; `AppPalette` ohne `onPrimary` in `HomeScreen.tsx`; `TYPOGRAPHY` ohne `caption` in `SettingsScreen.tsx`.
- **`pnpm exec tsx scripts/validate-routing.ts`:** Exit **1** — Skript erwartet alte Section-Dateinamen (`home-hero.tsx`, `survey-invite-section.tsx` …); aktuelle Struktur nutzt `HeroSection.tsx` u. a.
- **`pnpm exec tsx scripts/validate-content-isolation.ts`:** Exit **0** — „Content isolation: PASS”.

## Bekannte Deploy-/Struktur-Risiken (faktenbasiert)

| # | Thema | Status |
|---|-------|--------|
| D1 | **Root `pnpm build` baut nicht die Mobile-App** — nur `@resqbrain/website` | bekannt, kein Handlungsbedarf |
| D2 | **Mobile `tsc --noEmit`:** Exit 2 — `pnpm mobile:verify` blockiert | offen |
| D3 | **`validate-routing.ts`:** Exit 1 — Erwartungen veraltet gegenüber neuer Komponentenstruktur | offen |
| D4 | **Root-Level `app/`/`components/`/`lib/`:** Parallele Next.js-Struktur am Repo-Root; kein Vercel-Ziel, Zweck ungeklärt | offen |
| D5 | **`/mitwirken` vs. `/mitwirkung`:** Zwei ähnliche Routen in `apps/website`; inhaltliche Abgrenzung nicht dokumentiert | offen |
| D6 | **`/updates`-Route:** Datenpfad und Inhalt nicht spezifiziert | offen |
| D7 | **Umfrage-URL** in `lib/site/survey.ts`: vor produktivem Betrieb DPA/Privacy prüfen | bekannt |
| D8 | **`next-env.d.ts`** verweist nach Build auf `.next/types/routes.d.ts` — nach Clone ohne Build ggf. fehlerhafte TS-Pfade | bekannt |

## Nächste Deployment-Schritte

1. **Bundle-Persistenz-Konzept** abschließen — Voraussetzung für Mobile-Updates
2. **Root-Level-Struktur bereinigen** — entweder löschen oder als `apps/website-v2/` formalisieren
3. **Mobile `tsc` grün** — dann `pnpm mobile:verify` und anschließend Expo-Build
4. **`validate-routing.ts`** an aktuelle Section-Dateinamen anpassen oder außer Betrieb nehmen
5. **`/mitwirken` und `/updates`** inhaltlich spezifizieren und vollständig befüllen
