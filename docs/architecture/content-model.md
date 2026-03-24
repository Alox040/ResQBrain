# Content Model

## Content Types
- Algorithm
- Medication
- Protocol
- Guideline

## Content Common Attributes
- Organization scope
- Stable content identifier
- Version reference
- ApprovalStatus
- Effective date metadata
- Deprecation metadata
- Audit fields (author, reviewer, approver, change rationale)

## ContentPackage Structure
A ContentPackage is a coherent release unit containing selected content Versions:
- Package metadata (Organization, scope, target audience)
- Included Algorithms
- Included Medications
- Included Protocols
- Included Guidelines
- Compatibility and dependency notes
- Release notes

## Lifecycle
1. Content draft creation
2. Clinical and operational review
3. Approval decision
4. Package assembly
5. Package validation
6. Release publication
7. Post-release monitoring and deprecation management

## Validation Rules
- No package may be released with non-approved content.
- All included items must belong to the same Organization scope unless explicit cross-organization sharing policy exists.
- Package Version must be immutable once released.
