# Architektur (Export, codebasiert)

## Ordnerstruktur (relevant für Produkt)

- **`apps/mobile-app/`** — Expo-App: `App.tsx`, `src/navigation`, `src/screens`, `src/data`, `src/lookup` (u. a. `sourceResolver.ts`, `bundleUpdateService.ts`, `lookupCache.ts`, `bundleStorage.ts`, `loadLookupBundle.ts`), `src/types`, `src/ui`, `src/theme`, `src/state`, `src/features`.
- **`apps/website/`** — Next.js: `app/` (Routes), `components/` (`layout/`, `sections/`, `pages/`, `ui/`), `lib/` (`routes.ts`, `lib/site/*`), `styles/`, `public/`; Ordner `ui8/` (Assets/Vorlagen, u. a. ZIP-basierte Quellen; `*.zip` in Root-`.gitignore`).
- **`apps/website-pre-v2-backup/`** — Backup einer früheren Website-Variante (nicht in `pnpm-workspace.yaml`).
- **`apps/website-old/`** — ältere Next.js-Website; `vercel.json` mit `ignoreCommand`.
- **`packages/domain/src/`** — Domain-Logik, u. a.:
  - `content/entities/` — ApprovalStatus, ScopeTarget, Algorithm, Medication, Protocol, Guideline, ContentPackage, ContentPackageFoundation
  - `versioning/entities/` — u. a. CompositionEntry, ContentPackageVersion, ReleaseVersion, LineageState, …
  - `release/ReleaseEngine.ts`
  - `lifecycle/services/ContentLifecycleEngine.ts`
  - `governance/` — Policies, Entities, `approval/services/ApprovalEngine.ts`, `services/PermissionEngine.ts`
  - `audit/`, `survey/`, `tenant/`, `lookup/entities/`
- **`data/lookup-seed/`** — Phase-0-JSON: `manifest.json`, `medications.json`, `algorithms.json`.
- **`data/schemas/`** — `dbrd-normalized.schema.ts`, `dbrd-normalized.examples.json`.
- **`scripts/`** — u. a. `dbrd/`, `status/`, `utils/`, `vercel-ignore.js`, `validate-routing.ts`, `validate-content-isolation.ts`, `check-german-umlauts.ts`, `validate-algorithms.ts`, `import-dbrd.ts`, `transform-algorithms.ts`, `cleanup-algorithms.ts`.

**Zusatz (Root):** `app/`, `components/` — parallele/alte Struktur; nicht Root-`pnpm build`.

**Hinweis:** Unter `apps/` existiert ein leerer Ordnername `Neuer Ordner` (Stand Scan 5. April 2026).

## Navigation (Mobile-App)

**Datei:** `apps/mobile-app/src/navigation/AppNavigator.tsx`

- **Bottom Tabs (`RootTabParamList`):** `Home`, `Search`, `Favorites`, `Settings`, `MedicationTab`, `AlgorithmTab`.
- **Home-Stack (`HomeStackParamList` in `homeStackParamList.ts`):** `HomeMain`, `VitalReference`.
- **Medikament-Stack:** `MedicationListScreen` → `MedicationDetail` (Param: `medicationId`) → `DoseCalculator`.
- **Algorithmus-Stack:** `AlgorithmListScreen` → `AlgorithmDetail` (Param: `algorithmId`).

**Einstieg:** `App.tsx` — Hydration Favoriten/Verlauf/Recent, `resolveLookupBundle()` → `initializeContent(buildLookupRamStore(...))`, danach `NavigationContainer` + `AppNavigator`.

## Navigation / Routing (aktive Website)

**Datei:** `apps/website/lib/routes.ts`

- Routen-Objekt: `home` `/`, `kontakt`, `mitwirkung`, `links`, `impressum`, `datenschutz`.
- `mainNav` / `footerNav` wie im Quelltext.

**Startseite:** `app/page.tsx` — siehe Abschnitt Website-Sections unten.

**Layout:** `app/layout.tsx` — `SiteShell`, Schrift `Instrument_Sans` (`next/font/google`), `lang="de"`, Metadaten aus `lib/site/site-content.ts`.

## Domain Layer (`@resqbrain/domain`)

- **Exportfassade:** `packages/domain/src/index.ts` re-exportiert Content-Factory-Funktionen, Typen, Governance-Evaluatoren, `Versioning`, `Audit`, `release`, `survey`, `Lookup`.
- **Mobile-App:** `apps/mobile-app/package.json` listet `@resqbrain/domain` **nicht**; eigene Typen in `src/types/content.ts`, Validierung in `src/lookup/`.

## Datenmodelle (zwei Ebenen)

### A) Mobile Phase 0 (`apps/mobile-app/src/types/content.ts`)

- `ContentKind`: `'medication' | 'algorithm'`
- `ContentTag`: festes Vokabular — abgestimmt mit `lookupSchema.ts` (`CONTENT_TAG_VALUES`)
- `Medication` / `Algorithm` / `ContentItem` — wie Typdefinitionen

Validierung: `lookupSchema.ts` (`MEDICATION_ITEM_KEYS`, `ALGORITHM_ITEM_KEYS`, Manifest-Keys).

### B) Plattform-Domain (`packages/domain/src/content/entities/`)

- **Medication / Algorithm / Guideline / Protocol / ContentPackage** — org- und versionsbezogene Modelle; Algorithm mit `decisionLogic` (Graph), abweichend vom linearen Phase-0-`steps[]` der App.

## Mobile: Bundle-Auflösung und Quellen

- **`sourceResolver.ts`:** `resolveLookupBundle()` — Reihenfolge updated → cached → embedded → fallback; Rückgabetyp `ResolvedLookupBundle` mit `source`, `bundle`, `meta` (`BundleMeta`: `bundleId`, `generatedAt`, `schemaVersion`).
- **`bundleUpdateService.ts`:** Remote-Check/Apply (Aufruf aus `App.tsx` wenn `EXPO_PUBLIC_LOOKUP_BUNDLE_URL` gesetzt).
- **`lookupSource.ts`:** dokumentiert `LookupSource` (`embedded` | `cached` | `updated` | `fallback`).

## Versioning (Domain-Paket)

- **`packages/domain/src/versioning/entities/`:** u. a. `ContentPackageVersion`, `ReleaseVersion`, `CompositionEntry`, `LineageState`, …
- **`packages/domain/src/shared/versioning/`:** z. B. `assertExplicitVersionId`.

## Release Engine

- **`packages/domain/src/release/ReleaseEngine.ts`** — Release-Flow mit Policy-/Capability-Bezug; Tests `release.engine.test.ts`.
- **Mobile/Website:** kein direkter Aufruf in den App-Ordnern im Rahmen dieses Exports nachgewiesen.

## Content-Struktur (App-Laufzeit)

- **Medikamente** und **Algorithmen** aus JSON-Bundle; keine Protokolle/Leitlinien in `data/lookup-seed/`.

## Website-Sections (aktive `apps/website`)

**Datei:** `apps/website/app/page.tsx`

- Reihenfolge: `HeroSection` → `ProblemSection` → `IdeaSection` → `StatusSection` → `AudienceSection` → `MitwirkungSection` → `FaqSection` → `ContactCtaSection`  
- Texte/Konfiguration über `content` aus `@/lib/site/content`.

## Services (Domain-Paket, explizite `*Engine*` / Services)

| Pfad | Rolle (Kurzname) |
|------|------------------|
| `lifecycle/services/ContentLifecycleEngine.ts` | Content-Lifecycle |
| `governance/approval/services/ApprovalEngine.ts` | Freigabe / Approval |
| `governance/services/PermissionEngine.ts` | Berechtigungen |
| `release/ReleaseEngine.ts` | Release-Orchestrierung |

## Policies (`packages/domain/src/governance/policies/`)

Export in `policies/index.ts`:

- `OrganizationScopedAccessPolicy`, `TransitionAuthorizationPolicy`, `ApprovalResolutionPolicy`, `ReleaseAuthorizationPolicy`, `DeprecationAuthorizationPolicy`, `hasCapability`, `getCapabilityGrantingRoles`

## Entities (Governance, Auszug)

Unter anderem in `governance/entities/`: Capability, Permission, UserRole, ApprovalPolicy, … (siehe `packages/domain/src/governance/entities/index.ts`).
