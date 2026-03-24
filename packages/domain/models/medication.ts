import type { ContentEntityBase } from './content-entity-base';

/**
 * Medication reference with operational usage context and versioned revisions.
 *
 * Revisions are ContentEntityVersion rows (`targetKind: 'Medication'`) keyed by `currentVersionId`.
 *
 * @see docs/architecture/domain-model.md
 */
export interface Medication extends ContentEntityBase {
  kind: 'Medication';
}
