# Roadmap Status

**Last Updated:** 2026-04-15

## Phase 0 Status

Gesamtbewertung: **weitgehend umgesetzt** (Lookup-App + Einsatz-Features); Verteil-/Sync-Produkt **nicht**

## Fertig (Ist im Repo nachweisbar)

- Architektur- und Terminologie-Basis dokumentiert
- Website (Landing, Legal, interne Lab-/API-Routen) — siehe `docs/status/PROJECT_STATUS.md`
- Mobile: Lookup-Flows, Suche, Favoriten/Verlauf (AsyncStorage), Dosisrechner (heuristisch), Vitalreferenz, Einstellungen
- Lookup-Bundle: eingebettet; optional persistierter Cache; optional HTTP-Bundle-URL — siehe Status
- Domain-Paket `@resqbrain/domain` mit Release-/Versioning-Slices (Tests teilweise separat — siehe Status)

## In Arbeit / technische Schulden

- Domain-Content-Tests vs. vereinfachtes `Algorithm`-Modell
- Zwei verwandte Lookup-Lade-Pfade (`lookupSource.ts` vs. `loadLookupBundle.ts`) — konsolidieren oder strikt dokumentieren
- `FavoritesScreen` nicht im Navigator registriert (totes oder experimentelles Artefakt)

## Geplant / nicht gestartet (Plattform)

- mandantenfähige API/Auth und Runtime-Enforcement
- operativer org-spezifischer Release-/Sync-Betrieb
- Survey-Datenpipeline in produktiver Form
