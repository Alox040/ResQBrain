/**
 * Tenant boundary with governance, data ownership, and release scope.
 *
 * Owns Algorithms, Medications, Protocols, Guidelines, and organization-scoped ContentPackages.
 * Global templates (content or packages) are not Organization rows: those lines use
 * `organizationId: null` on the entity and on matching `Version` rows.
 *
 * @see docs/architecture/domain-model.md
 * @see docs/architecture/multi-tenant-model.md
 */
export interface Organization {
  id: string;
  name: string;
}
