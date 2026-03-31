# Kontext-Zusammenfassung (Export)

## Aktueller Stand

- **Monorepo** (pnpm): produktiv gebaut wird **`apps/website`** (Next.js 16.2.1) via Root-`pnpm build`; **`apps/mobile-app`** (Expo 54) separat (`pnpm mobile:verify`, Expo/tsc).
- **Domain** als Paket **`@resqbrain/domain`** — **ohne** Abhängigkeit in der Mobile-App.
- **Phase-0-Inhalt (Lookup-Bundle):** **9** Medikamente und **9** Algorithmen in `data/lookup-seed/`, validiert und in RAM geladen (`loadLookupBundle` / `contentIndex`); einige Dosistexte enthalten mg/µg-pro-kg-Hinweise für den Dosisrechner.
- **Zusätzlich:** **`apps/website-old/`** als Legacy-Site im Workspace; **Root-`vercel.json`** mit `rootDirectory: apps/website`; **DBRD-Tooling** unter `scripts/dbrd/` und `pnpm dbrd:*`.

## Was funktioniert (im Repo nachweisbar)

- **Website-Produktionsbuild:** `pnpm build` am Root → erfolgreicher `next build` (Lauf 31. März 2026); statische Routen `/`, `/kontakt`, `/links`, `/mitwirkung`, `/impressum`, `/datenschutz`.
- **Mobile Verifikation:** `pnpm mobile:verify` (Root) und `tsc --noEmit` in `apps/mobile-app` ohne Diagnosen (Lauf 31. März 2026).
- **Mobile UX-Flows:** Tabs + Stacks für Start/Home (inkl. Quick Access/Einsatzmodus), Suche, Favoriten, Medikamente (Liste/Detail/Dosisrechner), Algorithmen (Liste/Detail), Vitalwerte-Referenz sowie persistente Favoriten- und Verlaufs-Listen.
- **Umfrage-CTAs:** konfigurierbar über `apps/website/lib/public-config.ts` und `resolveSurveyLink()`.

## Was fehlt oder nur teilweise ist

- **Persistenz / Sync / produktionsreifes „Offline“** für medizinische Inhalte: Lookup-Bundle wird nur eingebettet und in RAM geladen (`loadLookupBundle.ts`); kein auf das Gerät heruntergeladenes/ersetztes Bundle, kein Sync.
- **CI:** keine GitHub/GitLab-Pipeline-Dateien im Repository.
- **Ein Paket unter `packages/`:** nur `domain` ist ein Workspace-Paket; `shared/` und `ui` ohne `package.json`.
- **Einheitliches Datenmodell App ↔ Domain:** Mobile nutzt Phase-0-JSON-Typen, nicht `@resqbrain/domain`-Entities.
- **Validierungsskripte:** `validate-routing.ts` und `validate-content-isolation.ts` liefern aktuell Exit **1** gegen `apps/website` (erwarten ältere Struktur bzw. andere Root-/Routen-Annahmen).

## Höchste Priorität (für externe Planung sinnvoll)

1. **Offline-Zielbild & Bundle-Persistenz:** Klarheit, wie Lookup-Bundles künftig geliefert, aktualisiert und ggf. organisationenspezifisch verteilt werden (Mapping auf `lookupSource`-Schichten).
2. **Sync-Konzept** (inhaltlich + technisch), sobald Bundle-Lieferung und Governance-/Versioning-Einbindung definiert sind.
3. **Validierungsskripte** (`validate-routing.ts`, `validate-content-isolation.ts`) an die aktuelle `apps/website`-Architektur anpassen oder klar als Checks für `apps/website-old` markieren.
4. **Deployment:** Root-`vercel.json` vs. `apps/website/vercel.json` und Branch-Policy (`website-old` mit `ignoreCommand`) im tatsächlichen Deployment-Setup eindeutig dokumentieren.

## Empfohlene nächste Schritte (neutral, aus Fakten abgeleitet)

- Seed- und DBRD-Pipeline (`pnpm dbrd:build`) in Release- oder Contentprozess verankern, falls das Sourcing darüber läuft.
- README- und Status-Tabellen (Routen, MVP-Screens, Umfrage-Risiko vs. `public-config.ts`) bereinigen.
- Mobile/Website-Release und Monitoring separat von Monorepo-`pnpm build` dokumentieren.
