export function resolveOrganizationScope(scope) {
    return scope.organizationId;
}
export function isScopeInOrganization(scope, context) {
    return resolveOrganizationScope(scope) === context.organizationId;
}
