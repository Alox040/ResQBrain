# Kontext-Zusammenfassung (Export)

## Aktueller Stand

- **Monorepo** (pnpm): produktiv gebaut wird **`apps/website`** (Next.js 16.2.1) via Root-`pnpm build`; **`apps/mobile-app`** (Expo 54) separat (Expo/tsc).
- **Domain** als Paket **`@resqbrain/domain`** — **ohne** Abhängigkeit in der Mobile-App.
- **Phase-0-Inhalt:** **4** Datensätze gesamt (**2** Medikamente, **2** Algorithmen) in `data/lookup-seed/`, validiert und in RAM geladen (`loadLookupBundle` / `contentIndex`).
- **Zusätzlich:** **`apps/website-old/`** als Legacy-Site im Workspace; **Root-`vercel.json`** mit `rootDirectory: apps/website`; **DBRD-Tooling** unter `scripts/dbrd/` und `pnpm dbrd:*`.

## Was funktioniert (im Repo nachweisbar)

- **Website-Produktionsbuild:** `pnpm build` am Root → erfolgreicher `next build` (Lauf 31. März 2026); statische Routen `/`, `/kontakt`, `/links`, `/mitwirkung`, `/impressum`, `/datenschutz`.
- **Mobile Typecheck:** `tsc --noEmit` in `apps/mobile-app` ohne Diagnosen (Lauf 31. März 2026).
- **Mobile UX-Flows:** Tabs + Stacks für Start, Suche, Medikamente, Algorithmen; Suche über Bundle; Detailansichten.
- **Umfrage-CTAs:** konfigurierbar über `apps/website/lib/public-config.ts` und `resolveSurveyLink()`.

## Was fehlt oder nur teilweise ist

- **Persistenz / Sync / produktionsreifes „Offline“** laut Code: kein Storage, kein Netzwerk, kein Sync — nur Bundle → RAM (`loadLookupBundle.ts`).
- **CI:** keine GitHub/GitLab-Pipeline-Dateien im Repository.
- **Ein Paket unter `packages/`:** nur `domain` ist ein Workspace-Paket; `shared/` und `ui/` ohne `package.json`.
- **Einheitliches Datenmodell App ↔ Domain:** Mobile nutzt Phase-0-JSON-Typen, nicht `@resqbrain/domain`-Entities.
- **Validierungsskripte:** `validate-routing.ts` und `validate-content-isolation.ts` liefern aktuell Exit **1** gegen `apps/website` (veraltete Erwartungen bzw. Route-Whitelist).
- **Dokumentationsabgleich:** `PROJECT_STATUS.md`, `PROJECT_ROADMAP.md`, README-Routen — teils hinter dem Code zurück.

## Höchste Priorität (für externe Planung sinnvoll)

1. **Dokumentation und Roadmap-Checkboxen** mit dem **Ist-Code** (Mobile-Loader/Suche/Screens, neue Website-Routen) synchronisieren.
2. **Validierungsskripte** an die aktuelle `apps/website`-Architektur anpassen oder als „website-old only“ kennzeichnen.
3. **Offline-Zielbild** aus `docs/context/` gegen RAM-Bundle-Implementierung entscheiden (Backlog).
4. **Deployment:** Root-`vercel.json` vs. `apps/website/vercel.json` und Branch-Policy (`website-old` mit `ignoreCommand`) klar im Betrieb halten.

## Empfohlene nächste Schritte (neutral, aus Fakten abgeleitet)

- Seed- und DBRD-Pipeline (`pnpm dbrd:build`) in Release- oder Contentprozess verankern, falls das Sourcing darüber läuft.
- README- und Status-Tabellen (Routen, MVP-Screens, Umfrage-Risiko vs. `public-config.ts`) bereinigen.
- Mobile/Website-Release und Monitoring separat von Monorepo-`pnpm build` dokumentieren.
