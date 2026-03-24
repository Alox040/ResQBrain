/**
 * Sub-scope for regional policy and content applicability.
 * @see docs/architecture/domain-model.md
 */
export interface Region {
  id: string;
  organizationId: string;
  name?: string;
  /** Optional refinement within regional scope (scope hierarchy). */
  countyId?: string;
}
