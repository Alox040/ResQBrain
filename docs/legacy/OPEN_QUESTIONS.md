# Open Questions

## Multi-Tenant Design
- How should tenant boundaries be represented at runtime beyond the current `orgId` field in profiles and Content Packages?
- What is the lifecycle for onboarding a new Organization and connecting it to Content Packages?
- Which data must be global versus strictly Organization-scoped?

## Organization Model
- Is Region/County/Station hierarchy required in the operational data model, and where should enforcement occur?
- How are organization-specific overrides resolved when multiple Content Packages apply?

## Algorithm Versioning
- Should algorithm versioning be item-level only, package-level only, or both?
- What approval and rollback rules are required before an updated algorithm becomes active?

## Medication Structure
- How should duplicate or alias medications be canonicalized while preserving local naming?
- Which medication constraints must be profile- or organization-specific (routes, physician-order requirements, qualification gates)?

## Protocol Structure
- How should protocol definitions map to operational workflows beyond current `PermissionRule` and Content Package models?
- What relationship should exist between protocol profile validity windows and Content Package versions?

## Offline Sync
- What offline model is intended for EMS Providers: full snapshot download, incremental sync, or hybrid?
- How are conflicts resolved when local state and updated Content Packages diverge?

## Permissions Model
- Are roles centrally standardized or organization-defined?
- Should deny/allow precedence and rule evaluation become configurable per organization?
- How should permissions be audited over time for regulated operational use?

## Content Editing
- Where and how will content be authored, reviewed, approved, and published?
- Which entities require explicit review workflows versus direct publish permissions?

## Data Storage
- What is the long-term source of truth for content beyond local seed files?
- How should local persisted user state and profile-specific state be migrated between versions?

## Deployment Model
- How will Content Package releases be promoted across environments?
- What runtime mechanism distributes updated Content Packages/profiles to clients?
- What observability and rollback controls are required for safe release operations?
