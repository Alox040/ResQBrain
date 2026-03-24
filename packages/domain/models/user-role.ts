/**
 * Role assignment scoped to Organization context.
 * @see docs/architecture/domain-model.md
 */
export interface UserRole {
  id: string;
  organizationId: string;
  userId: string;
  /** Stable key or identifier for the role definition within the platform. */
  roleKey: string;
}
