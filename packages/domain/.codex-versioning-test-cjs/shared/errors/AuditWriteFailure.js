"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditWriteFailure = void 0;
const DomainError_1 = require("./DomainError");
class AuditWriteFailure extends DomainError_1.DomainError {
    constructor(entityId, operation, context) {
        super('AUDIT_WRITE_FAILURE', `Audit write failed for ${operation} on ${entityId}`, {
            entityId,
            operation,
            ...context,
        });
    }
}
exports.AuditWriteFailure = AuditWriteFailure;
