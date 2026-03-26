import { ContentPackageDependencySeverity } from '../../versioning/entities';
export function validateContentPackageAssembly(input) {
    const issues = [];
    if (input.contentPackage.organizationId !== input.packageVersion.organizationId) {
        issues.push(error('PACKAGE_VERSION_ORGANIZATION_MISMATCH', 'ContentPackageVersion.organizationId must match ContentPackage.organizationId.'));
    }
    if (input.contentPackage.id !== input.packageVersion.packageId) {
        issues.push(error('PACKAGE_VERSION_PARENT_MISMATCH', 'ContentPackageVersion.packageId must match the parent ContentPackage id.'));
    }
    if (input.contentPackage.currentVersionId !== input.packageVersion.id) {
        issues.push(error('PACKAGE_CURRENT_VERSION_MISMATCH', 'ContentPackage.currentVersionId must reference the package version under validation.'));
    }
    collectDuplicateCompositionIssues(input.packageVersion.composition, issues);
    for (const resolvedEntry of input.resolvedEntries ?? []) {
        if (!resolvedEntry.versionExists) {
            issues.push(error('COMPOSITION_VERSION_NOT_FOUND', 'Referenced content version does not exist.', entryContext(resolvedEntry.entry)));
        }
        if (resolvedEntry.entityOrganizationId !== input.contentPackage.organizationId) {
            issues.push(error('CROSS_TENANT_COMPOSITION_ENTRY', 'Referenced content entity must belong to the same organization as the package.', {
                ...entryContext(resolvedEntry.entry),
                entityOrganizationId: resolvedEntry.entityOrganizationId,
                packageOrganizationId: input.contentPackage.organizationId,
            }));
        }
    }
    for (const resolvedScope of input.resolvedScopes ?? []) {
        if (resolvedScope.organizationId !== input.contentPackage.organizationId) {
            issues.push(error('CROSS_TENANT_SCOPE_ENTRY', 'All package scope entries must belong to the same organization as the package.', {
                scopeLevel: resolvedScope.scope.scopeLevel,
                scopeTargetId: resolvedScope.scope.scopeTargetId ?? null,
                scopeOrganizationId: resolvedScope.organizationId,
                packageOrganizationId: input.contentPackage.organizationId,
            }));
        }
    }
    return finalizeValidation(issues);
}
export function validateContentPackageRelease(input) {
    const assemblyResult = validateContentPackageAssembly(input);
    const issues = [...assemblyResult.errors];
    const warnings = [...assemblyResult.warnings];
    for (const resolvedEntry of input.resolvedEntries ?? []) {
        if (resolvedEntry.entityCurrentVersionId != null &&
            resolvedEntry.entityCurrentVersionId !== resolvedEntry.entry.versionId) {
            issues.push(error('COMPOSITION_VERSION_STALE', 'Referenced content version is stale because it no longer matches entity.currentVersionId.', {
                ...entryContext(resolvedEntry.entry),
                entityCurrentVersionId: resolvedEntry.entityCurrentVersionId,
            }));
        }
        if (resolvedEntry.entityApprovalStatus != null &&
            resolvedEntry.entityApprovalStatus !== 'Approved') {
            issues.push(error('COMPOSITION_ENTRY_NOT_APPROVED', 'Referenced content entity must be Approved at release time.', {
                ...entryContext(resolvedEntry.entry),
                approvalStatus: resolvedEntry.entityApprovalStatus,
            }));
        }
    }
    for (const resolvedScope of input.resolvedScopes ?? []) {
        if (resolvedScope.isActive === false) {
            issues.push(error('INACTIVE_SCOPE_TARGET', 'All resolved scope targets must be active at release time.', {
                scopeLevel: resolvedScope.scope.scopeLevel,
                scopeTargetId: resolvedScope.scope.scopeTargetId ?? null,
            }));
        }
    }
    const dependencyEvaluations = new Map((input.dependencyEvaluations ?? []).map((evaluation) => [
        createDependencyKey(evaluation.note),
        evaluation,
    ]));
    for (const note of input.packageVersion.dependencyNotes) {
        const evaluation = dependencyEvaluations.get(createDependencyKey(note));
        const satisfied = evaluation?.satisfied ?? false;
        if (satisfied) {
            continue;
        }
        const message = evaluation?.message ??
            `Dependency ${note.dependencyType} on ${note.targetEntityType}:${note.targetEntityId} is unresolved.`;
        const issueContext = {
            dependencyType: note.dependencyType,
            targetEntityType: note.targetEntityType,
            targetEntityId: note.targetEntityId,
            targetVersionId: note.targetVersionId,
            rationale: note.rationale,
        };
        if (note.severity === ContentPackageDependencySeverity.HARD_BLOCK) {
            issues.push(error('DEPENDENCY_HARD_BLOCK', message, issueContext));
            continue;
        }
        warnings.push(warn('DEPENDENCY_WARNING', message, issueContext));
    }
    return finalizeValidation([...issues, ...warnings]);
}
export function collectContentPackageValidationIssues(result) {
    return Object.freeze([...result.errors, ...result.warnings]);
}
function collectDuplicateCompositionIssues(composition, issues) {
    const seen = new Map();
    for (const entry of composition) {
        const duplicateKey = `${entry.entityType}:${entry.entityId}`;
        const existing = seen.get(duplicateKey);
        if (existing) {
            issues.push(error('DUPLICATE_COMPOSITION_ENTITY', 'A package version cannot include multiple versions of the same content entity.', {
                entityType: entry.entityType,
                entityId: entry.entityId,
                versionIds: [existing.versionId, entry.versionId],
            }));
            continue;
        }
        seen.set(duplicateKey, entry);
    }
}
function finalizeValidation(issues) {
    const errors = Object.freeze(issues.filter((issue) => issue.severity === 'Error'));
    const warnings = Object.freeze(issues.filter((issue) => issue.severity === 'Warning'));
    return Object.freeze({
        ok: errors.length === 0,
        errors,
        warnings,
    });
}
function createDependencyKey(note) {
    return [
        note.dependencyType,
        note.targetEntityType,
        note.targetEntityId,
        note.targetVersionId ?? '*',
        note.severity,
    ].join(':');
}
function entryContext(entry) {
    return Object.freeze({
        entityType: entry.entityType,
        entityId: entry.entityId,
        versionId: entry.versionId,
    });
}
function error(code, message, context) {
    return Object.freeze({
        severity: 'Error',
        code,
        message,
        context,
    });
}
function warn(code, message, context) {
    return Object.freeze({
        severity: 'Warning',
        code,
        message,
        context,
    });
}
