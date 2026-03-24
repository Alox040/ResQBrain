# Product Vision

## Mission
Provide a configurable EMS platform where each Organization can manage and distribute trusted medical and operational content for local use.

## Platform Outcome
The platform enables Regions, Counties, and EMS Providers to operate on a shared foundation while applying organization-specific content and governance.

## Core Capabilities
- Multi-tenant architecture with strict Organization boundaries.
- Versioned medical and operational content.
- Organization-specific customization without forking core logic.
- Deterministic content Releases to clients.
- Future-ready extension points for offline clients and survey-driven prioritization.

## Current Truth Extracted From Legacy Snapshot
- The legacy project originated as a single-application prototype with hardcoded and seed-based content assumptions.
- Product intent around medical reference content exists, but architecture decisions were mixed with implementation details.
- Terminology was inconsistent across algorithm/protocol/guideline concepts and across organization scopes.

## Strategic Direction
Move from prototype context to a domain-first platform context:
- One domain language shared across product and architecture artifacts.
- Content as managed, versioned platform data.
- Organizations as first-class boundaries for policy, content, and permissions.
