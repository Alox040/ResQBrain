# Domain Model

## Required Entities

### Organization
Represents a tenant boundary with governance, data ownership, and release scope.

### Region
Represents a sub-scope used for regional policy and content applicability.

### Station
Represents an operational unit within an Organization, optionally mapped to Region/County metadata.

### Algorithm
Structured medical decision pathway content managed by lifecycle state.

### Medication
Medication reference entity with operational usage context and versioned revisions.

### Protocol
Formal procedural standard used by an Organization.

### Guideline
Operational or medical recommendation content that complements Protocols.

### ContentPackage
Versioned collection of Algorithms, Medications, Protocols, and Guidelines prepared for Release.

### Version
Immutable identifier for a content state or package state used for audit and rollout.

### ApprovalStatus
Lifecycle state machine for content and packages (for example: Draft, InReview, Approved, Rejected, Released, Deprecated).

### UserRole
Role assignment model scoped to Organization context.

### Permission
Atomic capabilities evaluated per UserRole and Organization scope.

### SurveyInsight
Structured prioritization input linked to content demand, feature voting, and regional differences.

## Relationship Overview
- Organization has many Regions and Stations.
- Organization owns Algorithms, Medications, Protocols, Guidelines, and ContentPackages.
- ContentPackage contains specific Version references of content entities.
- Content and ContentPackages carry ApprovalStatus and Version history.
- UserRole grants Permissions within Organization scope.
- SurveyInsight can reference Organization, Region, County, and target content entities.

## Modeling Rules
- Every domain record includes Organization scope.
- Version history is append-only for released artifacts.
- ApprovalStatus transitions are policy-controlled by Role and Permission.
