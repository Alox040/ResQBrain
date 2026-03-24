# Versioning Model

## Versioning Goals
- Reproducible Releases
- Traceable change history
- Safe rollback capability
- Clear compatibility boundaries

## Version Units
- Individual content entity Version (Algorithm, Medication, Protocol, Guideline)
- ContentPackage Version
- Release record referencing one ContentPackage Version for a target Organization scope

## Lifecycle States
ApprovalStatus states support controlled promotion:
- Draft
- InReview
- Approved
- Rejected
- Released
- Deprecated

## Versioning Rules
- Released Versions are immutable.
- New changes create new Versions; they do not rewrite release history.
- A Release always points to explicit content Versions.
- Rollback publishes a new Release that references an earlier approved Version set.

## Governance Integration
- Only authorized UserRoles with required Permissions can approve or release.
- Version lineage must capture who changed what, when, and why.
- SurveyInsight can propose priorities for future Versions but cannot alter released artifacts.
