# Open Questions

## Product and Governance
- What is the minimum Organization onboarding dataset required before first content Release?
- Which ApprovalStatus transitions require dual review versus single approver flow?
- What governance model applies when Region guidance conflicts with County guidance?

## Data and Lifecycle
- What level of granularity is required for Versioning: per item, per ContentPackage, or both?
- What rollback policy is required for released content when safety issues are discovered?
- How should deprecation of Algorithms and Medications be represented across active Releases?

## Access and Security
- Which UserRoles are globally defined versus Organization-defined?
- What permission inheritance model is preferred across Organization, Region, and County scopes?

## Platform Growth
- What minimum telemetry is needed for content demand tracking without tying to client implementation?
- Which SurveyInsight signals should influence roadmap decisions versus local content prioritization?
- What federation model is needed if multiple Organizations share portions of a ContentPackage?

## Offline and Distribution
- What offline model is intended for EMS Providers: full ContentPackage snapshot download, incremental delta sync, or hybrid?
- How are conflicts resolved when cached client state and an updated ContentPackage diverge after reconnection?
- What runtime mechanism distributes updated ContentPackage Releases to connected clients?
- What observability and rollback controls are required for safe Release distribution?

## Content Authoring and Lifecycle
- Where and how will Algorithms, Medications, Protocols, and Guidelines be authored and published?
- Which content types require multi-step review workflows versus a single-approver path?
- How should deprecated content versions be communicated to clients with active ContentPackages referencing them?

## Data Provenance and Cross-Organization Content
- What is the authoritative content store beyond initial seed or import data?
- How should cross-Organization content sharing be modeled when baseline Algorithms or Medications are shared across tenants?
- How should local naming differences and medication aliases be canonicalized while preserving Organization-specific labels?
