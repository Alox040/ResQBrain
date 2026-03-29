# Architektur (Export, codebasiert)

## Ordnerstruktur (relevant für Produkt)

- **`apps/mobile-app/`** — Expo-App: `App.tsx`, `src/navigation`, `src/screens`, `src/data`, `src/lookup`, `src/types`, `src/ui`.
- **`apps/website/`** — Next.js: `app/` (Routes), `components/` (Layout, Sections, UI), `lib/` (Site-Konfiguration, ViewModels).
- **`packages/domain/src/`** — Domain-Logik, u. a.:
  - `content/entities/` — ApprovalStatus, ScopeTarget, Algorithm, Medication, Protocol, Guideline, ContentPackage, ContentPackageFoundation
  - `versioning/entities/` — u. a. CompositionEntry, ContentPackageVersion, ReleaseVersion, LineageState, …
  - `release/ReleaseEngine.ts`
  - `lifecycle/services/ContentLifecycleEngine.ts`
  - `governance/` — Policies, Entities, `approval/services/ApprovalEngine.ts`, `services/PermissionEngine.ts`
  - `audit/`, `survey/`, `tenant/`, `lookup/entities/` (eigenes Lookup-Modell im Domain-Paket)
- **`data/lookup-seed/`** — Phase-0-JSON: `manifest.json`, `medications.json`, `algorithms.json`.
- **`scripts/`** — Validierung, Vercel-Ignore, Status-Renderer, Umlaut-Check u. a.

**Zusatz (Root, nicht von Root-Build genutzt):** `app/`, `components/` am Repository-Root — parallele/alte Website-Struktur mit anderen Import-Pfaden.

## Navigation (Mobile-App)

**Datei:** `apps/mobile-app/src/navigation/AppNavigator.tsx`

- **Bottom Tabs (`RootTabParamList`):** `Home`, `Search`, `MedicationList`, `AlgorithmList`.
- **Medikament-Stack:** `MedicationList` → `MedicationDetail` (Param: `medicationId`).
- **Algorithmus-Stack:** `AlgorithmList` → `AlgorithmDetail` (Param: `algorithmId`).

**Einstieg:** `App.tsx` — `NavigationContainer` + `AppNavigator`.

## Domain Layer (`@resqbrain/domain`)

- **Exportfassade:** `packages/domain/src/index.ts` re-exportiert Content-Factory-Funktionen, Typen, Governance-Evaluatoren, `Versioning`, `Audit`, `release`, `survey`, `Lookup`.
- **Keine Abhängigkeit der Mobile-App vom Paket:** `apps/mobile-app/package.json` listet `@resqbrain/domain` **nicht**; Mobile nutzt eigene Typen in `src/types/content.ts` und Validierung in `src/lookup/`.

## Datenmodelle (zwei Ebenen)

### A) Mobile Phase 0 (`apps/mobile-app/src/types/content.ts`)

- `ContentKind`: `'medication' | 'algorithm'`
- `ContentTag`: festes Vokabular (kreislauf, atemwege, neurologie, …)
- `Medication`: Basis-Felder + `dosage`, `relatedAlgorithmIds`
- `Algorithm`: Basis-Felder + `steps: { text }[]`, optional `warnings`, `relatedMedicationIds`
- `ContentItem` — Union

Validierung der Keys: `lookupSchema.ts` (`MEDICATION_ITEM_KEYS`, `ALGORITHM_ITEM_KEYS`, Manifest-Keys).

### B) Plattform-Domain (`packages/domain/src/content/entities/`)

- **Medication:** u. a. `organizationId`, `title`, `genericName`, `brandNames`, `dosageGuidelines[]`, `approvalStatus`, `currentVersionId`, Audit-Trail, …
- **Algorithm:** u. a. `decisionLogic` (Graph-Knoten), `prerequisites`, Version/Approval — **abweichend** vom linearen Phase-0-`steps[]`-Modell der App.
- **Guideline, Protocol, ContentPackage:** eigene Entity-Dateien mit Org- und Versionsfeldern.

## Versioning (Domain-Paket)

- **`packages/domain/src/versioning/entities/`:** u. a. `ContentPackageVersion`, `ReleaseVersion`, `CompositionEntry`, `LineageState`, `ContentEntityVersion`, Abhängigkeits-Notizen.
- **`packages/domain/src/shared/versioning/`:** z. B. `assertExplicitVersionId` für explizite Versions-IDs.

## Release Engine

- **`packages/domain/src/release/ReleaseEngine.ts`** — Release-Flow mit Policy-/Capability-Bezug (Importe aus Governance, Content, Versioning); dazu Tests `release.engine.test.ts`.
- **Mobile/Website:** kein direkter Aufruf dieser Engine in den App-Ordnern (innerhalb dieses Exports nicht gesucht).

## Content-Struktur (App-Laufzeit)

- Nur **Medikamente** und **Algorithmen** aus JSON-Bundle; keine Protokolle/Leitlinien in `data/lookup-seed/`.

## Services (Domain-Paket, explizite `*Engine*` / Services)

| Pfad | Rolle (Kurzname) |
|------|------------------|
| `lifecycle/services/ContentLifecycleEngine.ts` | Content-Lifecycle |
| `governance/approval/services/ApprovalEngine.ts` | Freigabe / Approval |
| `governance/services/PermissionEngine.ts` | Berechtigungen |
| `release/ReleaseEngine.ts` | Release-Orchestrierung |

## Policies (`packages/domain/src/governance/policies/`)

Export in `policies/index.ts`:

- `OrganizationScopedAccessPolicy` (`evaluateAccess`)
- `TransitionAuthorizationPolicy` (`evaluateTransition`)
- `ApprovalResolutionPolicy` (`evaluateQuorum`)
- `ReleaseAuthorizationPolicy` (`evaluateRelease`)
- `DeprecationAuthorizationPolicy` (`evaluateDeprecation`)
- `hasCapability`, `getCapabilityGrantingRoles`

## Entities (Governance, Auszug)

Unter anderem in `governance/entities/`: Capability, Permission, UserRole, ApprovalPolicy, ApprovalDecision, DecisionStatus, ScopeLevel, … (siehe `packages/domain/src/governance/entities/index.ts`).
