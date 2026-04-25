# ResQBrain

ResQBrain ist ein Lookup-first Monorepo fuer strukturierte Wissensarbeit im Rettungsdienst.

## Aktueller Stand

- Mobile- und Website-Bereich sind aktiv in Arbeit.
- Domain-Versioning ist isoliert kompilierbar.
- Die Website baut erfolgreich und liefert die Kernrouten aus.

## Heute erledigt

- Vollstaendige Repository-Analyse (geaenderte Dateien, Marker, betroffene Bereiche).
- Domain-Validierung mit `pnpm --filter domain run compile:versioning`.
- Routing- und Link-Pruefung fuer `/`, `/impressum`, `/datenschutz`, Footer und CTAs.
- Build-Validierung mit `pnpm build`.
- Aktualisierung von `docs/status/PROJECT_STATUS.md`, `docs/status/WORK_SESSION.md` und `docs/roadmap/PROJECT_ROADMAP.md`.

## Naechste Schritte

1. Globalen TypeScript-Gate stabilisieren (`pnpm exec tsc --noEmit` soll wieder gruen werden).
2. Mobile-Aenderungen mit `pnpm mobile:verify` vollstaendig gegenpruefen.
3. Domain-Release-Logik schrittweise mit echter Bundle-Lieferstrecke verbinden.

## Bekannte Risiken

- `tmp/figma` verursacht aktuell globale TypeScript-Fehler (JSX-Flag / fehlende Module).
- Laufende Mobile-Aenderungen sind noch nicht ueber den kompletten Verify-Pfad abgesichert.
- Domain-Regeln sind strukturell vorhanden, aber noch nicht End-to-End in einer produktiven Lieferkette verankert.

## Build Status

- `pnpm build`: **erfolgreich** (Website-Build gruen).
- `pnpm exec tsc --noEmit`: **nicht gruen** (Fehler in `tmp/figma`).

## Website Status

- Kernrouten vorhanden: `/`, `/impressum`, `/datenschutz`.
- Footer-Links und zentrale CTAs sind dateibasiert konsistent.
- Build-Routenliste enthaelt die rechtlichen Seiten ohne 404-Hinweis.
