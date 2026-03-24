# Risk Log

## Active Risks

### R-001: Legacy Decision Contamination
- Description: Outdated assumptions from prototype documentation re-enter architecture decisions.
- Impact: Incorrect boundaries, rework, and governance drift.
- Mitigation: Treat this context set as source of truth and retire conflicting legacy references.

### R-002: Tenant Boundary Leakage
- Description: Content or permissions are evaluated without Organization scope.
- Impact: Data exposure and unsafe cross-organization behavior.
- Mitigation: Enforce Organization scoping in every domain operation and API contract.

### R-003: Uncontrolled Content Changes
- Description: Content updates bypass ApprovalStatus and Release controls.
- Impact: Clinical and operational safety risk.
- Mitigation: Require lifecycle state transitions and immutable release artifacts.

### R-004: Terminology Drift
- Description: Mixed naming for similar concepts causes implementation mismatch.
- Impact: Defect risk and slower onboarding.
- Mitigation: Use normalized vocabulary defined in context and architecture files only.

### R-005: Premature Stack Coupling
- Description: Architecture becomes tied to a framework or runtime too early.
- Impact: Reduced adaptability and avoidable migration cost.
- Mitigation: Keep architecture contracts technology-agnostic.

### R-006: Survey Signal Misuse
- Description: Future survey data drives unsafe medical content changes directly.
- Impact: Demand signals override safety and governance.
- Mitigation: SurveyInsight informs prioritization only; approval lifecycle remains mandatory.
