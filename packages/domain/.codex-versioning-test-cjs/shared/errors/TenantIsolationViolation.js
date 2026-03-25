"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantIsolationViolation = void 0;
const DomainError_1 = require("./DomainError");
class TenantIsolationViolation extends DomainError_1.DomainError {
    constructor(message, context) {
        super('TENANT_ISOLATION_VIOLATION', message, context);
    }
}
exports.TenantIsolationViolation = TenantIsolationViolation;
