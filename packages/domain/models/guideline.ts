import type { ContentEntityBase } from './content-entity-base';

/**
 * Operational or medical recommendation content that complements Protocols.
 *
 * Revisions are ContentEntityVersion rows (`targetKind: 'Guideline'`) keyed by `currentVersionId`.
 *
 * @see docs/architecture/domain-model.md
 */
export interface Guideline extends ContentEntityBase {
  kind: 'Guideline';
}
