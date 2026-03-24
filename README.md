# ResQBrain

Configurable multi-tenant EMS platform where each Organization manages and distributes trusted medical and operational content for local use, on a shared foundation with organization-specific content and governance.

# Problem

EMS knowledge is often spread across fragmented, local, and frequently outdated documents. Organizations need controlled ways to manage Algorithms, Medications, Protocols, and Guidelines with traceable updates.

Different Organizations require different approved content. Regions and Counties can impose local requirements that diverge from neighboring jurisdictions. Field operations require reliable access to approved content, including future offline operation. Content changes must be auditable and releasable by Version.

# Solution

A multi-tenant EMS platform that governs medical and operational content by Organization, supports versioned Releases, and allows controlled local customization across Region and County contexts. The platform manages clinical and operational content domains (Algorithm, Medication, Protocol, Guideline), packages and releases content by Organization with Version control, ApprovalStatus governance, and Permission enforcement. It is domain-driven and technology-agnostic, with reproducible Releases and extension points for offline-capable clients and survey-driven prioritization.

# Platform Concept

## Multi-organization support

Organization is the tenant boundary for governance, data ownership, and release scope. Every domain record includes Organization scope. Tenant boundaries are enforced in every content and permission decision. The platform is multi-tenant first; single-tenant design is explicitly out of scope.

## Custom algorithms

Algorithms are structured medical decision pathway content managed by lifecycle state. Organizations own Algorithms within their scope. Medical and operational content is managed as data, not embedded in application logic.

## Medication lists

Medications are reference entities with operational usage context and versioned revisions, owned by the Organization.

## Protocols

Protocols are formal procedural standards used by an Organization, governed through the same content lifecycle and versioning model as other content types.

## Regional configuration

Region represents a sub-scope for regional policy and content applicability. Regions and Counties appear in scoping metadata for Organization-specific applicability. Regional differences are modeled, not hardcoded.

# MVP Scope

- Organization onboarding metadata and tenant isolation rules.
- Domain entities for Algorithm, Medication, Protocol, Guideline, ContentPackage, Version, and ApprovalStatus.
- Role and Permission model for content lifecycle actions.
- Versioned content publishing model with explicit Release records.
- Region and County scoping metadata for Organization-specific applicability.
- Audit-ready change tracking for content and approvals.

MVP exit criteria: a content item can move from draft to approved to released under Role and Permission rules; Releases are reproducible by Version and scoped to Organization; platform terminology is consistent across product and architecture documentation.

# Not Part of MVP

From MVP boundaries:

- Final UI structure and client experience decisions.
- Backend technology selection.
- Full offline synchronization implementation.
- Survey engine implementation (only readiness model is required now).

Broader explicit non-goals include: defining a specific UI navigation, screen hierarchy, or client layout; committing to a specific framework, runtime, or backend stack; preserving prototype-era folder assumptions as architectural rules; treating mock or static demo content as production content governance; embedding hardcoded Algorithms, Medications, Protocols, or Guidelines in application logic; designing a single-tenant platform.

# Architecture Overview

High-level modules:

- **Domain** — entities, value objects, lifecycle rules, and invariants; independent from storage, transport, and UI.
- **Governance** — UserRole and Permission policies; enforcement of ApprovalStatus transition authorization.
- **Content lifecycle** — create, update, review, approve, and release orchestration; ContentPackage assembly and validation.
- **Tenant scope** — Organization, Region, County, and Station scoping logic; tenant isolation and regional applicability.
- **Versioning** — Version generation, lineage tracking, and rollback eligibility rules.
- **Survey Insight** — SurveyInsight ingestion, aggregation, and prioritization outputs; advisory signals only, no direct governance bypass.
- **Integration** — ports and contracts for storage, messaging, and client distribution; implementation stack replaceable.

Prohibited couplings: UI logic inside domain lifecycle decisions; infrastructure details embedded in entity rules; hardcoded tenant assumptions inside shared domain services.

# Domain Model

Core entities (see `docs/architecture/domain-model.md` for the full model):

- **Organization** — Tenant boundary with governance, data ownership, and release scope.
- **Region** — Sub-scope for regional policy and content applicability.
- **Algorithm** — Structured medical decision pathway content managed by lifecycle state.
- **Medication** — Medication reference entity with operational usage context and versioned revisions.
- **Protocol** — Formal procedural standard used by an Organization.
- **Guideline** — Operational or medical recommendation content that complements Protocols.
- **Version** — Immutable identifier for a content state or package state used for audit and rollout.
- **Role** — UserRole: role assignment model scoped to Organization context.

# Folder Structure

- **docs/context** — Product and platform context: vision, problem space, target users, MVP scope, decisions, and related canonical context.
- **docs/architecture** — Technical architecture: system overview, domain model, module boundaries, and related canonical architecture.
- **docs/surveys** — Location for survey-related documentation aligned with SurveyInsight and the Survey Insight module.
- **apps** — `apps/mobile-app` holds the mobile application area; architecture makes no assumption about mobile, web, or desktop client primacy.
- **packages** — `packages/domain` holds shared domain packages.

# Survey Integration

SurveyInsight is a structured prioritization input linked to content demand, feature voting, and regional differences; it can reference Organization, Region, County, and target content entities. SurveyInsight is part of platform planning inputs, with implementation deferred. The Survey Insight module owns ingestion, aggregation, and prioritization outputs and provides advisory signals only. Future SurveyInsight signals feed prioritization for upcoming Versions. The survey engine itself is out of scope for MVP implementation except for a readiness model.

# Current Status

The project is in a foundation phase: architecture-first, with domain model, governance, and tenant design documented before implementation choices. There are no production features yet beyond this documentation baseline.

# Design Principles

- **Domain-first** — Domain model and lifecycle rules are authoritative; UI and framework are implementation details.
- **Multi-tenant ready** — Organization is a first-class boundary for content, permissions, and release scope; tenant isolation is required everywhere.
- **No hardcoded medical content** — Algorithms, Medications, Protocols, and Guidelines are managed as platform data, not embedded in application logic.
- **Versioned protocols** — Content and ContentPackages use explicit Versioning and Release records; released artifacts follow append-only version history rules.
- **Extensible architecture** — No fixed UI structure or backend stack; module boundaries keep storage, messaging, and clients replaceable.
