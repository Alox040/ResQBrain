# Projekt-Roadmap

Stand: 25. April 2026

## Fortschritt (aktualisiert)

| Bereich | Status | Hinweis |
| --- | --- | --- |
| Domain Versioning | [x] | Isolierte Kompilierung (`compile:versioning`) erfolgreich bestaetigt. |
| Website Build | [x] | `pnpm build` erfolgreich, Kernrouten erzeugt. |
| Rechtliche Routen | [x] | `/impressum` und `/datenschutz` vorhanden und build-seitig aufgeloest. |
| Routing-Links (Footer/CTA/Hero/Mitwirkung) | [~] | Dateibasiert konsistent; kein Browser-E2E in dieser Session. |
| Globaler TS-Gate (`tsc --noEmit`) | [ ] | Aktuell durch `tmp/figma` nicht gruen. |

## Erledigte Punkte

- [x] Tagesabschluss-Validierung fuer Domain, Website, Routing und Build.
- [x] Statusdokumente und README auf den aktuellen Stand gebracht.
- [x] Risiken und naechste Schritte priorisiert dokumentiert.

## Naechste Phase (hervorgehoben)

### Phase A - Validierungsstabilitaet (sofort)

1. `tmp/figma` sauber aus globalem TypeScript-Scope nehmen oder eigene TS-Konfiguration trennen.
2. Danach `pnpm exec tsc --noEmit` erneut als festen Gate etablieren.

### Phase B - Mobile Qualitaetsabschluss (kurzfristig)

1. Offene Mobile-Aenderungen mit `pnpm mobile:verify` absichern.
2. Navigation und Detailfluesse manuell gegen geaenderte Screens gegenpruefen.

### Phase C - Architekturkonvergenz (mittelfristig)

1. Domain-Release-Logik und reale Bundle-Auslieferung enger koppeln.
2. Tenant-/Org-Regeln von Modell in technische Lieferstrecke ueberfuehren.
