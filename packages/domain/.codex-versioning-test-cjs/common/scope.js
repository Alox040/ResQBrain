"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveOrganizationScope = resolveOrganizationScope;
exports.isScopeInOrganization = isScopeInOrganization;
function resolveOrganizationScope(scope) {
    return scope.organizationId;
}
function isScopeInOrganization(scope, context) {
    return resolveOrganizationScope(scope) === context.organizationId;
}
