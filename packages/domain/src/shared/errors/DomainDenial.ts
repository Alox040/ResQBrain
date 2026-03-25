import type { DenyReason } from '../types/DenyReason';
import type { OrgId } from '../types/OrgId';

export class DomainDenial {
  readonly type = 'DOMAIN_DENIAL' as const;

  readonly denyReason: DenyReason;

  readonly organizationId: OrgId;

  readonly context: Readonly<Record<string, unknown>>;

  constructor(
    denyReason: DenyReason,
    context: Readonly<Record<string, unknown>>,
    organizationId: OrgId,
  ) {
    this.denyReason = denyReason;
    this.organizationId = organizationId;
    this.context = Object.freeze({ ...context });

    Object.freeze(this);
  }
}
