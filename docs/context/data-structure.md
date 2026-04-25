# data-structure

Stand: April 2026

## Modell 1: Phase-0 Lookup-Bundle (aktiv, implementiert)

In-Memory-Struktur `LookupRamStore` (`src/lookup/loadLookupBundle.ts`):

```
LookupRamStore
├── medications: Medication[]
├── algorithms: Algorithm[]
├── contentItems: ContentItem[]
├── contentLookup: Record<ContentKey, ContentItem>   // key = "${kind}:${id}"
├── searchItems: ContentListItem[]
├── searchIndexItems: Array<ContentListItem & { searchTerms: string[] }>
├── versionInfo: LookupBundleVersionInfo
├── manifest: { bundleId, version, ... }
├── getMedicationById(id): Medication | undefined
└── getAlgorithmById(id): Algorithm | undefined
```

Typen in `src/types/content.ts`:
- `ContentKind`: `'medication' | 'algorithm'`
- `ContentItem`: Union aus Medication und Algorithm
- `ContentListItem`: Listenrepräsentation mit Such-Feldern
- `ContentCategory`: Kategorie-Enum

Adapter in `src/data/adapters/`:
- `mapMedicationToViewModel.ts`
- `mapAlgorithmToViewModel.ts`
- `resolveContentViewModel.ts`
- `viewModels.ts` — ViewModel-Typen

ContentKey-Format: `"${kind}:${id}"` — erzeugt über `toLookupContentKey()` / `toContentKey()`.

## Modell 2: Plattform-Domain-Modell (geplant, kein Code)

Definiert in `docs/architecture/domain-model.md` und `docs/architecture/content-model.md`.
Kein Code in `packages/domain`.

Geplante Entities: Content, Tenant, Governance, Versioning, Lifecycle, Release, Audit, Survey.
Dieses Modell hat andere Regeln als das Mobile-Lookup-Bundle — kein implizites Mapping annehmen.

## Modell 3: Application / API Contracts (geplant, kein Code)

`packages/application` und `packages/api`: Ordner vorhanden, kein Code.

HTTP-API-Typen für deaktivierten Lookup-Client vorhanden in:
`src/lib/lookup-api/types.ts` — LookupAlgorithmsResponse, LookupMedicationsResponse, LookupSearchResponse, etc.

## Modell 4: Website-Content (implementiert)

- `apps/website/lib/site/content.ts` — `homeContent` (alle Startseiteninhalte)
- `apps/website/lib/site/survey.ts` — Survey-Typen und aktive Umfrage-URL
- `apps/website/lib/site/updates-form.ts` — Updates-Formular-Konfiguration
- `apps/website/lib/site/public-links.ts` — Links-Verzeichnis
- `apps/website/lib/routes.ts` — Route-Definitionen und Navigation-Arrays

## Bekannte Probleme

- Root-Verzeichnis enthält Duplikate von `lib/site/*` parallel zu `apps/website/lib/site/` — welcher Pfad kanonisch ist, ist nicht dokumentiert; Synchronisation nicht gesichert.
- HTTP-API-Typen (`lib/lookup-api/types.ts`) sind vorhanden, aber der zugehörige Client ist deaktiviert.
- `bundleUpdateService.ts`: Version-Comparison-Logik (`compareBundleVersion`) ist funktional implementiert, aber `downloadBundle()` schlägt immer fehl — dormante Infrastruktur.
