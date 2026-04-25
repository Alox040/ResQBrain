# known-issues

Stand: April 2026

## Bugs (verifiziert)

| # | Problem | Ort | Auswirkung |
|---|---|---|---|
| 1 | EPERM bei `tsconfig.tsbuildinfo` und `.next/trace` | `apps/website/` | Website-Build lokal nicht vollständig verifizierbar (Windows-Datei-Lock) |
| 2 | EPERM bei `tsx --test` | Test-Pipeline | API-Tests können lokal nicht ausgeführt werden |
| 3 | `tsconfig.tsbuildinfo` versioniert | `apps/website/tsconfig.tsbuildinfo` | Konflikte bei parallelen Builds, falsche Diff-Signale |

## Tech-Debt

| # | Problem | Ort | Beschreibung |
|---|---|---|---|
| 4 | HTTP-Client vorhanden, aber deaktiviert | `src/lib/lookup-api/client.ts` | Jeder Aufruf wirft sofort `LOOKUP_HTTP_DISABLED`. Dead-Code oder Phase-2-Stub — noch nicht entschieden. |
| 5 | Remote-Manifest immer `{status: 'error'}` | `src/lookup/fetchRemoteManifest.ts` | Funktionskörper deaktiviert, gibt immer `{reason: 'offline'}` zurück. |
| 6 | `downloadBundle()` immer `{status: 'error'}` | `src/lookup/bundleUpdateService.ts` | Gesamter Remote-Update-Pfad ist Dead-Code für Phase-0. |
| 7 | `LookupBundleUpdateService` deaktiviert | `src/lookup/LookupBundleUpdateService.ts` | Weiterer Layer des deaktivierten Update-Pfads. |
| 8 | Root-Level-Duplikate `lib/`, `app/`, `components/`, `src/` | Repo-Root | Synchronisation mit `apps/website/` nicht gesichert; Verwechslungsgefahr. |
| 9 | Zwei Routen `/mitwirkung` + `/mitwirken` in Haupt-Nav | `apps/website/lib/routes.ts` | Semantisch überlappend, beide aktiv. |
| 10 | `packages/domain`, `packages/application`, `packages/api` leer | `packages/` | Referenziert in Architektur, kein Code vorhanden. |
| 11 | `dist-validation/metadata.json` versioniert | `apps/mobile-app/dist-validation/` | Build-Artefakt im Repo. |

## Risiken

| # | Risiko | Auswirkung |
|---|---|---|
| 12 | Datenzugriff ohne `ensureContentStoreReady()` | Laufzeit-Exception bei jedem Datenzugriff vor App-Init |
| 13 | Mobile Lookup-Modell ≠ Plattform-Domain-Modell | Mapping-Konventionen noch nicht definiert — spätere Migration aufwendiger |
| 14 | Website-Build nicht lokal verifiziert | Produktions-Build-Status nach letzten Änderungen (25.04.2026) unklar |
| 15 | Root-`lib/site/`-Dateien können von `apps/website/lib/site/` abweichen | Content-Drift ohne Warnung möglich |
