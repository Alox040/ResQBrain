import type { ContentEntityBase } from './content-entity-base';

/**
 * Structured medical decision pathway content managed by lifecycle state.
 *
 * Revisions are ContentEntityVersion rows (`targetKind: 'Algorithm'`) keyed by `currentVersionId`.
 *
 * @see docs/architecture/domain-model.md
 */
export interface Algorithm extends ContentEntityBase {
  kind: 'Algorithm';
}
