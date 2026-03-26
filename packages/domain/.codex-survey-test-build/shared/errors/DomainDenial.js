export class DomainDenial {
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
