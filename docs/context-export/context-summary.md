# Kontext-Zusammenfassung (Export)

**Letzte Verifikation:** 8. April 2026 — `pnpm build` (Root), `pnpm mobile:verify`, `pnpm --filter @resqbrain/domain exec tsc -p tsconfig.json --noEmit`, `validate-routing`, `validate-content-isolation`.

## Aktueller Stand

- **Monorepo** (pnpm): Root-`pnpm build` baut **`@resqbrain/website`** (Next.js 16.2.1, **10** statische Seiten). **`apps/mobile-app`** separat; **`pnpm mobile:verify` grün** im Export-Lauf.
- **Workspace** laut `pnpm-workspace.yaml`: nur `apps/mobile-app`, `apps/website`, `packages/*`. Zusätzlich im Baum: `apps/website-old`, `apps/website-pre-v2-backup` (nicht im Workspace).
- **Domain** `@resqbrain/domain` — **ohne** Dependency in der Mobile-App.
- **Lookup-Seed:** **10** Medikamente, **9** Algorithmen in `data/lookup-seed/`; Manifest mit `version` / `checksum` / `createdAt` (siehe `data-structure.md`).
- **Mobile:** `resolveLookupBundle()` + optional `EXPO_PUBLIC_LOOKUP_BUNDLE_URL` (Hintergrund-Update-Codepfad in `App.tsx`); `resolved.meta.version` für Debug-Info.
- **Orchestrierung:** Root `pnpm verify` (`scripts/verify.ts`) — scheitert nach Build an **`validate-routing`** (Exit 1).

## Was funktioniert (im Repo nachweisbar)

- **Website-Produktionsbuild:** `pnpm build` am Root → Exit 0; statische Routen `/`, `/kontakt`, `/links`, `/mitwirkung`, `/mitwirken`, `/updates`, `/impressum`, `/datenschutz`.
- **Website-Startseite:** `app/page.tsx` mit `SectionFrame`/`Container` und Inhalten aus `lib/site/content.ts`.
- **Website-Umfrage / Formulare:** `lib/site/survey.ts` (`surveys.active` → Microsoft Forms); `/updates` mit `updates-page.ts` / `updates-form.ts` (optional `NEXT_PUBLIC_UPDATES_FORM_URL`).
- **Domain-Paket:** `tsc --noEmit` gesamtes Paket Exit 0.
- **Mobile:** `tsc --noEmit` Exit 0; Nav-Verifikationsskripte OK; `expo export` im `verify:local`-Pfad OK.
- **Mobile Navigation:** Verlauf über Stack-Screen `History` / `HistoryScreen` erreichbar.
- **Root-Skripte:** `pnpm dbrd:*`, `pnpm seed:update` vorhanden.

## Was fehlt oder nur teilweise ist

- **`pnpm verify`:** nicht durchgängig grün — bricht an `validate-routing` ab; `validate-content-isolation` separat Exit 1.
- **Persistenter Bundle-Ersatz / produktives Sync:** Resolver und Update-Hooks vorhanden; End-to-End-Betrieb und Governance-Anbindung offen (Roadmap).
- **CI:** keine GitHub/GitLab-Pipeline-Dateien.
- **Validierungsskripte vs. Realität:** `allowedRoutes` ohne neue Pfade; Section-Import-Heuristik veraltet.
- **Einheitliches Datenmodell App ↔ Domain:** Mobile nutzt Phase-0-JSON, nicht Domain-Entities.
- **Live-Deployment:** in diesem Lauf nicht per Vercel-API/Dashboard verifiziert.

## Höchste Priorität

1. **`validate-content-isolation.ts` und `validate-routing.ts`** an aktuelle Routen und Startseiten-Aufbau anpassen — Ziel: `pnpm verify` grün.
2. **Bundle-Persistenz — Konzept:** `lookupSource` / Lieferpfad dokumentieren und umsetzen (Roadmap Phase 0).
3. **Root-Level-Struktur klären:** `app/`, `components/`, `lib/` am Repo-Root — bereinigen oder formalisieren.
4. **Sync-Konzept** (inhaltlich, als Dokument / Betriebsstory).

## Empfohlene nächste Schritte (neutral)

- Nach Skript-Fix: `pnpm verify` und ggf. `pnpm mobile:verify` in CI aufnehmen, sobald Pipeline existiert.
- Seed/DBRD bei Contentänderungen: `pnpm dbrd:build`.
- Deployment: Root- vs. App-`vercel.json` und `website-old`-Ignore in der realen Vercel-Konfiguration dokumentieren.
