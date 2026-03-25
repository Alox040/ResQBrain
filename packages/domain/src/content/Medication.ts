import type { MedicationId } from '../common/ids';
import type { ContentRecord } from './ContentRecord';

export interface Medication extends ContentRecord<MedicationId, 'Medication'> {
  readonly dosageNotes: ReadonlyArray<string>;
  readonly contraindications: ReadonlyArray<string>;
  readonly administrationRoutes: ReadonlyArray<string>;
}
