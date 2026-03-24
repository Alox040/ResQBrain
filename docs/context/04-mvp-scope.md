# MVP Scope

## MVP Objective
Deliver a safe, multi-tenant foundation for managing and releasing EMS content by Organization.

## In Scope
- Organization onboarding metadata and tenant isolation rules.
- Domain entities for Algorithm, Medication, Protocol, Guideline, ContentPackage, Version, and ApprovalStatus.
- Role and Permission model for content lifecycle actions.
- Versioned content publishing model with explicit Release records.
- Region and County scoping metadata for Organization-specific applicability.
- Audit-ready change tracking for content and approvals.

## Out of Scope for MVP Implementation
- Final UI structure and client experience decisions.
- Backend technology selection.
- Full offline synchronization implementation.
- Survey engine implementation (only readiness model is required now).

## MVP Exit Criteria
- A content item can move from draft to approved to released under Role and Permission rules.
- Releases are reproducible by Version and scoped to Organization.
- Platform terminology is consistent across product and architecture documentation.
