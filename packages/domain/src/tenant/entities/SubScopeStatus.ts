export enum SubScopeStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  DECOMMISSIONED = 'Decommissioned',
}

export type HierarchicalSubScopeStatus =
  | SubScopeStatus.ACTIVE
  | SubScopeStatus.INACTIVE;
