import type { GuidelineId, ProtocolId } from '../common/ids';
import type { ContentRecord } from './ContentRecord';

export interface Protocol extends ContentRecord<ProtocolId, 'Protocol'> {
  readonly operationalContext: string;
  readonly procedureSteps: ReadonlyArray<string>;
  readonly relatedGuidelineIds: ReadonlyArray<GuidelineId>;
}
