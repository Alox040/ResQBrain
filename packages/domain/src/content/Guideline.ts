import type { GuidelineId, ProtocolId } from '../common/ids';
import type { ContentRecord } from './ContentRecord';

export interface Guideline extends ContentRecord<GuidelineId, 'Guideline'> {
  readonly topic: string;
  readonly recommendations: ReadonlyArray<string>;
  readonly relatedProtocolIds: ReadonlyArray<ProtocolId>;
}
