# Kontext-Zusammenfassung (Export)

**Letzte Verifikation:** 5. April 2026 (`pnpm build` Root, `tsc` Mobile, `validate-routing`, `validate-content-isolation` — siehe `deployment.md`).

## Aktueller Stand

- **Monorepo** (pnpm): Root-`pnpm build` baut **`@resqbrain/website`** (Next.js 16.2.1). **`apps/mobile-app`** separat; **`pnpm mobile:verify` derzeit rot** wegen `tsc --noEmit`.
- **Workspace** laut `pnpm-workspace.yaml`: nur `apps/mobile-app`, `apps/website`, `packages/*`. Zusätzlich im Baum: `apps/website-old`, `apps/website-pre-v2-backup` (nicht im Workspace).
- **Domain** `@resqbrain/domain` — **ohne** Dependency in der Mobile-App.
- **Lookup-Seed:** **10** Medikamente, **9** Algorithmen in `data/lookup-seed/`; Manifest mit `version` / `checksum` / `createdAt` (siehe `data-structure.md`).
- **Mobile:** `resolveLookupBundle()` + optional `EXPO_PUBLIC_LOOKUP_BUNDLE_URL` (Hintergrund-Update-Codepfad in `App.tsx`).

## Was funktioniert (im Repo nachweisbar)

- **Website-Produktionsbuild:** `pnpm build` am Root → Exit 0; statische Routen `/`, `/kontakt`, `/links`, `/mitwirkung`, `/impressum`, `/datenschutz`.
- **`validate-content-isolation.ts`:** letzter Lauf Exit 0 (PASS).
- **Mobile UX (laut Navigation):** Tabs + Stacks für Home (inkl. Vitalwerte), Suche, Favoriten, Settings, Medikamente, Algorithmen; Favoriten/Verlauf/Recent über Stores + Hydration in `App.tsx`.
- **Website-Copy:** zentral u. a. `lib/site/content.ts`; Umfrage-Links aus `lib/site/survey.ts` (derzeit Platzhalter-URL).

## Was fehlt oder nur teilweise ist

- **Mobile Typecheck / `pnpm mobile:verify`:** Exit 2 — Typinkonsistenzen (`ResolvedLookupBundle`, `AppPalette`, `TYPOGRAPHY`).
- **Persistenter Bundle-Ersatz / produktives Sync:** Resolver und Update-Hooks vorhanden; End-to-End-Betrieb und Governance-Anbindung offen (Roadmap).
- **CI:** keine GitHub/GitLab-Pipeline-Dateien.
- **`validate-routing.ts`:** Exit 1 gegen aktuelle Section-Struktur.
- **Einheitliches Datenmodell App ↔ Domain:** Mobile nutzt Phase-0-JSON, nicht Domain-Entities.
- **`HistoryScreen`:** nicht im Navigator registriert.

## Höchste Priorität

1. **Mobile `tsc` grün** — blockiert `verify:local` und damit Nav-/Export-Schritte der Kette.
2. **`validate-routing.ts`** an `app/page.tsx` und tatsächliche Section-Dateien anpassen oder Scope dokumentieren.
3. **Offline/Sync-Zielbild** mit Bundle-URL, Cache-Speicher und Release-Prozess verbinden.
4. **Produktive Umfrage-URL** statt `example.com` in `lib/site/survey.ts` (und README-Risiko anpassen).

## Empfohlene nächste Schritte (neutral)

- Nach Fix von Mobile-`tsc`: `pnpm mobile:verify` erneut fahren.
- Seed/DBRD bei Contentänderungen: `pnpm dbrd:build`.
- Deployment: Root- vs. App-`vercel.json` und `website-old`-Ignore in der realen Vercel-Konfiguration dokumentieren.
