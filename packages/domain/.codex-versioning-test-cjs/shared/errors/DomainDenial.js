"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainDenial = void 0;
class DomainDenial {
    type = 'DOMAIN_DENIAL';
    denyReason;
    organizationId;
    context;
    constructor(denyReason, context, organizationId) {
        this.denyReason = denyReason;
        this.organizationId = organizationId;
        this.context = Object.freeze({ ...context });
        Object.freeze(this);
    }
}
exports.DomainDenial = DomainDenial;
