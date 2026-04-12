# Deployment & Build (Export)

**Stand:** 12. April 2026 — aus Konfigurationsdateien und `package.json`; keine Live-Deploy-Verifikation.

---

## Vercel Setup

| Datei | Inhalt (kurz) |
|-------|----------------|
| `vercel.json` (Repo-Root) | `rootDirectory: "apps/website"`, `installCommand: pnpm install`, `buildCommand: pnpm --filter @resqbrain/website build`, `outputDirectory: "apps/website/.next"` |
| `apps/website/vercel.json` | `framework: nextjs`, `installCommand`, `buildCommand` (ohne `rootDirectory`) |

---

## Expo Setup

- **App:** `apps/mobile-app`
- **`app.json`:** vorhanden (Details nicht vollständig extrahiert).
- **Scripts:** `expo start`, `expo export` für Android/iOS (`package.json`).

---

## Build Commands (Root `package.json`)

| Script | Befehl |
|--------|--------|
| `build` | `pnpm --filter @resqbrain/website build` |
| `build:api-local` | `pnpm --filter @resqbrain/api-local build` |
| `build:website` | `pnpm --filter @resqbrain/website build` |
| `test` | `pnpm --filter @resqbrain/api test` |
| `verify` | `tsx scripts/verify.ts` |
| `mobile:verify` | `pnpm --filter @resqbrain/mobile-app run verify:local` |
| `mobile:verify:doctor` | `pnpm --filter @resqbrain/mobile-app run verify:expo-doctor` |
| DBRD-Pipeline | `dbrd:normalize`, `dbrd:validate-normalized`, `dbrd:build-lookup-seed`, `dbrd:build`, … |

---

## Scripts (Auswahl unter `scripts/`)

- **`verify.ts`:** sequentiell `pnpm build` → `validate-routing.ts` → `validate-content-isolation.ts` → `mobile:verify`.
- **`vercel-ignore.js`:** Branch-Filter für Vercel Ignore Build Step.
- **`dbrd/`:** Normalisierung, Validierung, Lookup-Seed-Build.
- **`status/`:** Render-Skripte für Status-/Website-/Roadmap-Dokumente.
- **`check-german-umlauts.ts`:** Prüfung auf Umlaute (Zweck aus Dateinamen ersichtlich; Details nicht expandiert).

---

## CI Logik

- Im Repo-Root wurde **keine** Datei `gitlab-ci.yml` / `.gitlab-ci.yml` gefunden (Suche nach `**/*gitlab*`).
- **`pnpm verify`** dient als **lokale** Orchestrierung (siehe `scripts/verify.ts`).

---

## Ignore Steps (Vercel)

- **`scripts/vercel-ignore.js`:** Wenn `VERCEL_GIT_COMMIT_REF` **nicht** in `{ main, master }`, Exit `0` → Build wird übersprungen; sonst Exit `1` → Build läuft weiter.
- Kommentar im Skript: Ignore Step läuft **vor** Dependency-Install und darf keine lokalen CLIs wie `tsx` benötigen.

---

## Bekannte Deploy-Probleme

- **Nicht aus Deploy-Logs verifiziert** in diesem Export.
- **Doku:** `README.md` / Roadmap beschreiben erfolgreiche Validierungsläufe (Stand April 2026); keine widersprüchlichen Deploy-Fehler in den gelesenen Ausschnitten dokumentiert.
