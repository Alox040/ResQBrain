# Multi-Tenant Model

## Tenant Boundary
Organization is the primary tenant boundary for data ownership, permissions, and release visibility.

## Scope Hierarchy
- Organization
- Region
- County
- Station

## Isolation Requirements
- Data isolation by Organization for all content and governance entities.
- Permission evaluation includes UserRole plus Organization context.
- Cross-tenant access is denied by default.

## Customization Model
- Organizations can define local variants of Algorithms, Medications, Protocols, and Guidelines.
- Region and County constraints can refine applicability within an Organization.
- Shared baseline content is allowed only through explicit content sharing policies and controlled inheritance.

## Operational Implications
- Every query and command must include Organization context.
- Tenant scope is part of auditing, release history, and analytics partitions.
- Regional feature differences are modeled as scoped configuration, not separate products.
