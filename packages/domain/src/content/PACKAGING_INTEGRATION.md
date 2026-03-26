# Packaging Foundation (Content Layer)

Die Packaging-Schicht lebt unter `content/entities/ContentPackageFoundation.ts` und ergänzt die bestehenden Aggregate `ContentPackage` / `ContentPackageVersion` (Versioning) ohne neue Modulebenen.

## Integration

- **Exports**: `entities/index.ts` re-exportiert die Foundation; der Paket-Entry `src/index.ts` exportiert die Validierungs-API und zugehörige Typen.
- **Imports**: nur `shared`, `versioning`, `content` (kein `governance`, `lifecycle`, keine Services).
- **Orchestrierung**: Reine Funktionen; Auflösung von Einträgen, Scopes und Dependency-Satisfaction bleibt beim Aufrufer (`resolvedEntries`, `resolvedScopes`, `dependencyEvaluations`).

## Guardrails (Absicht)

- Keine `latest`-Strings in Versionsreferenzen (bereits in `CompositionEntry` / `ContentPackage` erzwungen).
- Cross-Tenant nur über explizit gelieferte `entityOrganizationId` / `organizationId` der Scope-Ziele — keine Heuristik.
- Composition ist `versionId`-basiert; Release prüft optional Konsistenz mit `entityCurrentVersionId`, wenn der Aufrufer diese liefert.

## Bekannte Spannungsfelder

- `PACKAGE_CURRENT_VERSION_MISMATCH`: Validierung setzt voraus, dass `ContentPackage.currentVersionId` genau die validierte `ContentPackageVersion.id` ist — sinnvoll für das gebundene Aggregat, ungeeignet für „Kandidaten-Version“ ohne vorherige Pointer-Aktualisierung.
- `COMPOSITION_VERSION_STALE`: bindet Composition an den vom Aufrufer gelieferten HEAD (`entityCurrentVersionId`) — explizite IDs, aber zusätzliche Konsistenzregel über reines „Version-Existiert“ hinaus.
