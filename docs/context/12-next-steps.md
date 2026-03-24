# Next Steps

## Immediate Priorities

### 1. Lock the Domain Baseline
Define the canonical domain model as executable types and contracts, aligned with `docs/architecture/domain-model.md`. This is the prerequisite for all subsequent implementation.

### 2. Decide Content Sourcing Architecture
Determine whether initial content (Algorithms, Medications, Protocols, Guidelines) flows from migrated seed data, new authoring tooling, or an import contract. Define the authoritative store.

### 3. Define the Content Lifecycle as Domain Services
Implement the Draft → InReview → Approved → Released state machine as domain-level services, not as UI-embedded logic. Tie ApprovalStatus transitions to UserRole and Permission checks.

### 4. Establish Organization and Tenant Scope
Implement Organization as a runtime boundary. Every domain operation and query must include and enforce Organization context before any multi-Organization scenario is attempted.

### 5. Expand Profile and Role Support Beyond Default
The prototype supports only a single default profile. The platform requires runtime-resolved UserRole and ContentPackage per Organization context.

### 6. Define API and Authentication Boundaries
Specify what contracts exist between the domain layer and client consumers. Authentication and identity management are prerequisites for any production or multi-user deployment.

### 7. Define the ContentPackage Release Mechanism
Determine how Releases are assembled, validated, published, and distributed to clients. This must include Version immutability guarantees and rollback capability.

### 8. Resolve Seed Data Quality
Finalize deduplication and text cleanup decisions for existing seed content before migrating it into a governed content store.

## Deferred Until Later Phases

- Offline synchronization engine and conflict resolution.
- Survey data ingestion and SurveyInsight prioritization dashboards.
- Release distribution automation and observability tooling.
- Regional and County override workflows beyond basic scoping metadata.
