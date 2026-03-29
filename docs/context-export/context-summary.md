# Kontext-Zusammenfassung (Export)

## Aktueller Stand

- **Monorepo** (pnpm): produktiv genutzte Apps sind **`apps/website`** (Next.js 16) und **`apps/mobile-app`** (Expo 54).
- **Domain** als Paket **`@resqbrain/domain`** mit umfangreichem TypeScript-Modell (Content, Governance, Versioning, Release, Lifecycle, Audit, Survey, Lookup-Entities) — **ohne** Abhängigkeit von der Mobile-App.
- **Phase-0-Inhalt** für die Mobile-App: **4** Datensätze gesamt (**2** Medikamente, **2** Algorithmen) in `data/lookup-seed/`, validiert und in RAM geladen.

## Was funktioniert (im Repo nachweisbar)

- **Website-Produktionsbuild:** `pnpm build` am Root → erfolgreicher `next build` für `@resqbrain/website`.
- **Mobile Typecheck:** `tsc --noEmit` in `apps/mobile-app` ohne Diagnosen (Export-Lauf).
- **Mobile UX-Flows:** Tabs + Stacks für Start, Suche, Medikamente, Algorithmen; Suche über eingebettetes Bundle; Detailansichten.
- **Vercel-Konfiguration** für die Website mit Branch-`ignoreCommand`.

## Was fehlt oder nur teilweise ist

- **Persistenz / Sync / „echtes“ Offline** laut Code-Kommentar: kein Storage, kein Netzwerk, kein Sync — nur Bundle → RAM.
- **CI:** keine GitHub/GitLab-Pipeline-Dateien im Repository.
- **Ein Paket unter `packages/`:** nur `domain` ist real; `shared/` und `ui/` sind leer bzw. ohne `package.json`.
- **Einheitliches Datenmodell App ↔ Domain:** Mobile nutzt Phase-0-JSON-Typen, nicht `@resqbrain/domain`-Entities.
- **Dokumentationsabgleich:** `PROJECT_STATUS.md` und `PROJECT_ROADMAP.md` beschreiben Mobile/Loader teils als offen, obwohl Code vorhanden ist.

## Höchste Priorität (für externe Planung sinnvoll)

1. **Produkt vs. Code:** MVP-Ziele (Offline, Seed-Umfang, Performance < 3 s) gegen Ist-Stand (`loadLookupBundle` nur RAM) entscheiden und Backlog ableiten.
2. **Dokumentation synchronisieren**, damit Planung nicht auf veralteten Checkboxen basiert.
3. **Deployment-Klarheit:** kanonisches Verzeichnis `apps/website` vs. Root-`app/`/`components/`; fehlende CI ergänzen, falls gewünscht.
4. **Architektur-Pfad:** ob/wann Mobile `@resqbrain/domain` oder Lookup-Entities aus dem Domain-Paket anbinden soll.

## Empfohlene nächste Schritte (neutral, aus Fakten abgeleitet)

- Roadmap- und Statusdateien mit dem **tatsächlichen** Mobile- und Seed-Stand aktualisieren.
- Offline-Anforderungen aus `docs/context/` in **konkrete** technische Tasks übersetzen (Storage, Update-Mechanismus).
- Seed-Daten und Suchanforderungen quantifizieren (mehr Inhalte, ggf. Index-Optimierung).
- Release-/Hosting-Prozess für Website und Mobile separat dokumentieren (nicht aus `pnpm build` ableitbar).
