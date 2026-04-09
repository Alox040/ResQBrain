import type { MedicationDetailDto } from '../../../../application/src/lookup/dto/MedicationDetailDto';
import type { MedicationId } from '../../../../domain/src/shared/types';
import {
  LOOKUP_PILOT_ORGANIZATION_ID,
  LOOKUP_PILOT_REGION_ID,
  LOOKUP_PILOT_RELEASED_AT,
  LOOKUP_PILOT_STATION_ID,
  LOOKUP_PILOT_VERSION_ID,
  LOOKUP_PILOT_VERSION_LABEL,
} from './algorithms';

export interface MedicationMockRecord extends MedicationDetailDto {
  readonly id: MedicationId;
  readonly searchTerms: ReadonlyArray<string>;
}

export const MEDICATION_MOCK_DATA: ReadonlyArray<MedicationMockRecord> = [
  {
    id: 'med-adrenalin' as MedicationId,
    name: 'Adrenalin',
    summary: 'Katecholamin fuer Reanimation und anaphylaktischen Schock.',
    category: 'Notfallmedikation',
    organizationId: LOOKUP_PILOT_ORGANIZATION_ID,
    regionId: LOOKUP_PILOT_REGION_ID,
    stationId: LOOKUP_PILOT_STATION_ID,
    currentReleasedVersionId: LOOKUP_PILOT_VERSION_ID,
    versionLabel: LOOKUP_PILOT_VERSION_LABEL,
    lastReleasedAt: LOOKUP_PILOT_RELEASED_AT,
    tags: ['reanimation', 'anaphylaxie', 'vasopressor'],
    visibility: null,
    scope: null,
    searchTerms: ['adrenalin', 'epinephrin', 'reanimation', 'anaphylaxie'],
  },
  {
    id: 'med-glukose' as MedicationId,
    name: 'Glukose 40%',
    summary: 'Hypertonische Glukoseloesung bei schwerer Hypoglykaemie.',
    category: 'Notfallmedikation',
    organizationId: LOOKUP_PILOT_ORGANIZATION_ID,
    regionId: null,
    stationId: null,
    currentReleasedVersionId: LOOKUP_PILOT_VERSION_ID,
    versionLabel: LOOKUP_PILOT_VERSION_LABEL,
    lastReleasedAt: LOOKUP_PILOT_RELEASED_AT,
    tags: ['stoffwechsel', 'zucker', 'glukose'],
    visibility: null,
    scope: null,
    searchTerms: ['glukose', 'hypoglykaemie', 'unterzuckerung', 'dextrose'],
  },
  {
    id: 'med-salbutamol' as MedicationId,
    name: 'Salbutamol',
    summary: 'Bronchodilatator bei bronchospastischer Atemnot.',
    category: 'Atemweg',
    organizationId: LOOKUP_PILOT_ORGANIZATION_ID,
    regionId: LOOKUP_PILOT_REGION_ID,
    stationId: null,
    currentReleasedVersionId: LOOKUP_PILOT_VERSION_ID,
    versionLabel: LOOKUP_PILOT_VERSION_LABEL,
    lastReleasedAt: LOOKUP_PILOT_RELEASED_AT,
    tags: ['bronchospasmus', 'asthma', 'atemweg'],
    visibility: null,
    scope: null,
    searchTerms: ['salbutamol', 'bronchospasmus', 'asthma', 'inhalation'],
  },
] as const;
