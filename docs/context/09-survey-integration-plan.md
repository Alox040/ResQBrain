# Survey Integration Plan

## Purpose
Prepare the platform to ingest SurveyInsight signals for roadmap and content demand decisions without changing clinical governance rules.

## Survey Readiness Principles
- SurveyInsight is advisory input, not an approval mechanism.
- Survey data is tenant-aware and scoped to Organization, Region, and County.
- Survey signals must be traceable to Version and Release planning decisions.

## Planned Capabilities
- Collect demand and feedback signals for Algorithms, Medications, Protocols, and Guidelines.
- Compare demand across Organizations while preserving tenant boundaries.
- Support feature voting and priority ranking by Organization context.
- Track content demand trends over time and correlate with Releases.

## Required Domain Extensions
- `SurveyInsight` linked to Organization, optional Region/County scope, and target domain entity.
- Classification fields for insight type (demand, gap, issue, vote) and confidence.
- Aggregation model for trend analysis by Version window.

## Governance Rules
- SurveyInsight can create prioritization candidates.
- SurveyInsight cannot auto-approve or auto-release content.
- Medical review and ApprovalStatus workflow remain mandatory.

## Integration Phasing
- Phase A: Define data contracts and storage boundaries.
- Phase B: Add prioritization dashboards and decision support outputs.
- Phase C: Close-loop reporting from Release outcomes back into SurveyInsight analysis.
