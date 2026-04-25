# deployment

Stand: April 2026

## Vercel-Konfiguration

Datei: `vercel.json` (Repo-Root)

```json
{
  "framework": "nextjs",
  "rootDirectory": "apps/website",
  "installCommand": "pnpm install",
  "buildCommand": "pnpm --filter @resqbrain/website build",
  "outputDirectory": "apps/website/.next"
}
```

- Framework: Next.js (App Router)
- Root: `apps/website` — korrekt konfiguriert
- Package-Manager: pnpm
- Branch: main

## Status

- Vercel-Deploy-Konfiguration: korrekt, kein falscher Branch, kein falsches Root-Verzeichnis
- Letzter bekannter produktiver Commit: dd2eea8 (25.04.2026, HeroSection-Fix)
- Vercel CLI: lokal nicht installiert — kein `vercel env pull`, kein `vercel logs` verfügbar

## Bekannte Probleme

- Website-Build lokal nicht vollständig verifizierbar: EPERM-Fehler bei `apps/website/tsconfig.tsbuildinfo` und `.next/trace` (Windows-Datei-Lock)
- `tsconfig.tsbuildinfo` ist im Repository versioniert — erzeugt Konflikte bei parallelen Build-Läufen und falsche Diff-Signale
- Kein bestätigter Build-Status nach letzten Änderungen (25.04.2026)

## Was NICHT konfiguriert ist

- Keine Preview-Branch-Regeln in `vercel.json`
- Kein separater Staging-Deploy
- Keine Cron-Jobs
- Keine Serverless Functions
- Keine dokumentierten Environment Variables (unbekannt ob auf Vercel gesetzt)
