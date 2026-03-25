import type { AlgorithmId } from '../common/ids';
import type { ContentRecord } from './ContentRecord';

export interface Algorithm extends ContentRecord<AlgorithmId, 'Algorithm'> {
  readonly clinicalFocus: string;
  readonly entryCriteria: ReadonlyArray<string>;
  readonly decisionSteps: ReadonlyArray<string>;
}
