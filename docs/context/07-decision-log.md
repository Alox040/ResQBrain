# Decision Log

## 2026-03-23

### Decision: Single App Foundation
The architecture context is defined without duplicate app roots or temporary prototype structures.

Rationale:
- Legacy context showed drift caused by competing root assumptions.
- A single foundation reduces ambiguity in ownership and governance.

### Decision: Multi-Tenant First
Organization is a first-class boundary for content, permissions, and release scope.

Rationale:
- Platform goal requires Region and County variability under Organization control.
- Single-tenant assumptions block the target operating model.

### Decision: Content Versioning Required
Algorithms, Medications, Protocols, Guidelines, and ContentPackages require explicit Versioning and Release records.

Rationale:
- Medical and operational safety requires reproducible history.
- Controlled rollout and rollback depend on versioned artifacts.

### Decision: No Hardcoded Algorithms
Medical and operational content must be managed as data, not embedded business logic.

Rationale:
- Hardcoding prevents Organization customization and safe release management.

### Decision: Organization-Specific Data
Each Organization can define or override content within its allowed scope.

Rationale:
- Regional and county-level variance is a core platform requirement.

### Decision: Survey-Driven Roadmap
SurveyInsight is part of platform planning inputs, with implementation deferred.

Rationale:
- Demand and adoption signals are needed for prioritization across Organizations.

### Decision: Domain-First Architecture
Domain model and lifecycle rules are authoritative; UI and framework are implementation details.

Rationale:
- Legacy context mixed implementation choices with architecture.
- Domain-first guidance enables safe evolution across clients and services.
