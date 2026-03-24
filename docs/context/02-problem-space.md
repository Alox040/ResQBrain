# Problem Space

## Primary Problem
EMS knowledge is often distributed through fragmented, local, and frequently outdated documents. Organizations need controlled ways to manage Algorithms, Medications, Protocols, and Guidelines with traceable updates.

## Operational Constraints
- Different Organizations require different approved content.
- Regions and Counties can impose local requirements that diverge from neighboring jurisdictions.
- Field operations require reliable access to approved content, including future offline operation.
- Content changes must be auditable and releasable by Version.

## Legacy Issues Identified
- UI-first assumptions obscured domain boundaries.
- Framework-specific and prototype assumptions were treated as architectural constraints.
- Hardcoded or static content patterns were too close to product behavior.
- Single-tenant assumptions limited organization-specific governance.

## Normalized Problem Statement
Build a multi-tenant EMS platform that governs medical and operational content by Organization, supports Versioned Releases, and allows controlled local customization across Region and County contexts.

## Success Criteria
- Domain concepts are independent of UI and framework choices.
- Content lifecycle is explicit: draft, review, approval, release.
- Tenant boundaries are enforced in every content and permission decision.
- Regional differences are modeled, not hardcoded.
