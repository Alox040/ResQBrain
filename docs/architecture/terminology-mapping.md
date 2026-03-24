# Terminology Mapping

## Purpose
This document maps prototype-era code names to the normalized platform vocabulary used in all `docs/context` and `docs/architecture` files. Any implementation referencing legacy names must be migrated to the canonical terms before production use.

## Canonical Platform Terms

| Platform Term       | Prototype Code Name     | Notes                                                                 |
|---------------------|-------------------------|-----------------------------------------------------------------------|
| ContentPackage      | ContentBundle / bundle  | Versioned release unit containing content scoped to an Organization.  |
| Organization        | orgId (field only)      | Full first-class tenant entity; was only a scalar field in prototype. |
| UserRole            | PermissionRule / profile | Role scoped to Organization; replaces ad-hoc profile identifiers.    |
| Permission          | PermissionRule          | Atomic capability evaluated per UserRole and Organization scope.      |
| ApprovalStatus      | (implicit / absent)     | Explicit lifecycle state machine; not implemented in prototype.       |
| Release             | (absent)                | Immutable, versioned publication record; does not exist in prototype. |
| Protocol            | (absent as type)        | Formal procedural standard; was conflated with Algorithm in prototype.|
| Guideline           | (absent as type)        | Operational recommendation content; not modeled in prototype.         |
| Region              | (absent as entity)      | Sub-scope for regional policy; was not a runtime entity in prototype. |
| Station             | (absent as entity)      | Operational unit within Organization; not modeled in prototype.       |
| SurveyInsight       | (absent)                | Advisory prioritization signal; not implemented in prototype.         |

## Naming Rules
- Use only platform terms in all new architecture and implementation artifacts.
- Do not introduce prototype code names in new design documents or domain code.
- When migrating prototype code, rename to canonical terms as the first step before extending behavior.
