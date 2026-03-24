# Platform Principles

## P-01 Domain First
Domain entities and lifecycle rules are primary. Delivery channels and frameworks are secondary.

## P-02 Organization Boundaries by Default
Every write, read, and release operation is scoped to Organization context.

## P-03 Versioned Content as Safety Baseline
Clinical and operational content is managed through explicit Version and Release controls.

## P-04 Configurable, Not Forked
Regional and county differences are modeled as configuration and scoped overrides, not product forks.

## P-05 Governance Before Distribution
ApprovalStatus and Permission checks are prerequisites for any Release.

## P-06 Technology-Agnostic Architecture
Context and architecture documents avoid assumptions about UI structure, app framework, or backend stack.

## P-07 Survey-Informed Prioritization
SurveyInsight informs prioritization and demand planning while never bypassing safety governance.

## P-08 Single Source of Truth Documentation
`docs/context` and `docs/architecture` define canonical platform intent and boundaries.
