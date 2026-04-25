# context-summary

Stand: April 2026

## Kritische Fakten

1. ResQBrain ist eine offline-first Lookup-App (Expo/React Native) für den Rettungsdienst mit begleitender Next.js-Website.
2. Die Mobile-App läuft stabil: eingebettetes Offline-Bundle, 5-Tab-Navigation, Expo-Export verifiziert.
3. HTTP-Lookup-Client und alle Remote-Update-Pfade sind absichtlich deaktiviert (Phase-0-Entscheidung).
4. Jeder Datenzugriff in der Mobile-App erfordert vorheriges `ensureContentStoreReady()` — synchrone Zugriffe ohne Init werfen eine Laufzeit-Exception.
5. Die Website (`apps/website`) ist auf Vercel deployed; `rootDirectory` ist korrekt auf `apps/website` konfiguriert.
6. Website-Build ist lokal nicht vollständig verifizierbar (EPERM-Fehler auf Windows bei Build-Artefakten).
7. `packages/domain`, `packages/application`, `packages/api` existieren nur als leere Ordner — kein implementierter Domain-Code.
8. Die Website hat zwei semantisch überlappende Hauptnavigations-Routen: `/mitwirkung` und `/mitwirken`.
9. Root-Verzeichnis enthält `lib/`, `app/`, `components/` parallel zu `apps/website/` — nicht automatisch produktiv, Verwechslungsgefahr.
10. `tsconfig.tsbuildinfo` und `dist-validation/metadata.json` sind versioniert — gehören in `.gitignore`.
11. Aktive Survey-URL: `https://forms.cloud.microsoft/r/AubZiQ0SQw` (April 2026, "UI & UX Feedback").
12. Remote-Bundle-Update-Infrastruktur ist im Code vorhanden (`bundleUpdateService`, `fetchRemoteManifest`, `LookupBundleUpdateService`), aber vollständig deaktiviert.
13. `apps/website-lab/` und `apps/mobile-app-lab/` sind Laborpfade — nicht produktiv.
14. Nächste unmittelbare Aufgaben: `.gitignore` bereinigen, Root-Duplikate klären, `/mitwirkung` vs. `/mitwirken` lösen, Website-Build stabilisieren.
15. Kanonische Lesereihenfolge: `project-overview` → `architecture` → `repo-structure` → `app-status` → `website-status` → `data-structure` → `roadmap` → `known-issues`.

## Datei-Zuständigkeiten

| Datei | Zuständig für |
|---|---|
| `project-overview.md` | Ziel, was existiert, was nicht gebaut ist |
| `architecture.md` | Schichten, Module, Architekturprobleme |
| `repo-structure.md` | Tatsächliche Ordnerstruktur |
| `app-status.md` | Mobile-App-Betrieb, Navigation, Features, Bugs |
| `website-status.md` | Seiten, Sections, CTAs, bekannte Probleme |
| `deployment.md` | Vercel-Konfiguration, Build-Status, offene Punkte |
| `data-structure.md` | Datenmodelle, Typen, Adapter |
| `roadmap.md` | Priorisierte, umsetzbare nächste Schritte |
| `known-issues.md` | Bugs, Tech-Debt, Risiken |
