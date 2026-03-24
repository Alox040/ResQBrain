# Module Boundaries

## Boundary Objective
Separate platform concerns so that domain integrity does not depend on interface or infrastructure choices.

## Modules

### Domain Module
- Owns entities, value objects, lifecycle rules, and invariants.
- Independent from storage, transport, and UI concerns.

### Governance Module
- Owns UserRole and Permission policies.
- Enforces ApprovalStatus transition authorization.

### Content Lifecycle Module
- Owns create/update/review/approve/release orchestration.
- Assembles and validates ContentPackage composition.

### Tenant Scope Module
- Owns Organization, Region, County, and Station scoping logic.
- Enforces tenant isolation and regional applicability.

### Versioning Module
- Owns Version generation, lineage tracking, and rollback eligibility rules.

### Survey Insight Module
- Owns SurveyInsight ingestion, aggregation, and prioritization outputs.
- Provides advisory signals only; no direct governance bypass.

### Integration Module
- Defines ports/contracts for storage, messaging, and client distribution.
- Keeps implementation stack replaceable.

## Prohibited Couplings
- UI logic inside domain lifecycle decisions.
- Infrastructure details embedded in entity rules.
- Hardcoded tenant assumptions inside shared domain services.
