/**
 * Operational unit within an Organization, optionally tied to Region / county metadata.
 * @see docs/architecture/domain-model.md
 */
export interface Station {
  id: string;
  organizationId: string;
  name?: string;
  regionId?: string;
  countyId?: string;
}
