import type { ContentEntityBase } from './content-entity-base';

/**
 * Formal procedural standard used by an Organization.
 *
 * Revisions are ContentEntityVersion rows (`targetKind: 'Protocol'`) keyed by `currentVersionId`.
 *
 * @see docs/architecture/domain-model.md
 */
export interface Protocol extends ContentEntityBase {
  kind: 'Protocol';
}
