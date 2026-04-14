/** Lookup blueprint (canonical definitions under `packages/domain/models`). */
export type { Algorithm, AlgorithmStep } from './Algorithm';
export { createAlgorithm, createAlgorithmStep } from './Algorithm';

export type { Medication } from './Medication';
export { createMedication } from './Medication';

export type { Contraindication, ContraindicationSeverity } from './Contraindication';
export { createContraindication } from './Contraindication';

/**
 * Vorherige / parallele Lookup-Wertobjekte — nicht Teil des Blueprint-`Medication`/`Algorithm`,
 * bleiben exportiert für bestehende Importe und spätere Migration.
 */
export type { Dose, AgeGroup, RouteOfAdministration } from './Dose';
export { createDose } from './Dose';

export type { Indication } from './Indication';
export { createIndication } from './Indication';

export type { Version } from './Version';
export { createVersion } from './Version';
