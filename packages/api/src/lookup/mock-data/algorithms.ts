import type { AlgorithmDetailDto } from '../../../../application/src/lookup/dto/AlgorithmDetailDto';
import type {
  AlgorithmId,
  OrgId,
  RegionId,
  StationId,
  VersionId,
} from '../../../../domain/src/shared/types';

export interface AlgorithmMockRecord extends AlgorithmDetailDto {
  readonly id: AlgorithmId;
  readonly searchTerms: ReadonlyArray<string>;
}

export const LOOKUP_PILOT_ORGANIZATION_ID = 'pilot-wache-001' as OrgId;
export const LOOKUP_PILOT_REGION_ID = 'pilot-region-nord' as RegionId;
export const LOOKUP_PILOT_STATION_ID = 'pilot-station-01' as StationId;
export const LOOKUP_PILOT_VERSION_ID = 'pilot-wache-001@2026.03.29.1' as VersionId;
export const LOOKUP_PILOT_VERSION_LABEL = '2026.03.29.1';
export const LOOKUP_PILOT_RELEASED_AT = '2026-03-29T19:02:49.378Z';

export const ALGORITHM_MOCK_DATA: ReadonlyArray<AlgorithmMockRecord> = [
  {
    id: 'alg-cpr-adult' as AlgorithmId,
    title: 'Reanimation Erwachsene',
    summary: 'Basisalgorithmus fuer Kreislaufstillstand bei Erwachsenen.',
    category: 'Notfall',
    organizationId: LOOKUP_PILOT_ORGANIZATION_ID,
    regionId: LOOKUP_PILOT_REGION_ID,
    stationId: LOOKUP_PILOT_STATION_ID,
    currentReleasedVersionId: LOOKUP_PILOT_VERSION_ID,
    versionLabel: LOOKUP_PILOT_VERSION_LABEL,
    lastReleasedAt: LOOKUP_PILOT_RELEASED_AT,
    tags: ['reanimation', 'als', 'cpr'],
    visibility: null,
    scope: null,
    searchTerms: ['reanimation', 'kreislaufstillstand', 'cpr', 'als', 'adrenalin'],
  },
  {
    id: 'alg-anaphylaxis' as AlgorithmId,
    title: 'Anaphylaxie',
    summary: 'Erstversorgung bei schwerer allergischer Reaktion.',
    category: 'Atemweg',
    organizationId: LOOKUP_PILOT_ORGANIZATION_ID,
    regionId: LOOKUP_PILOT_REGION_ID,
    stationId: null,
    currentReleasedVersionId: LOOKUP_PILOT_VERSION_ID,
    versionLabel: LOOKUP_PILOT_VERSION_LABEL,
    lastReleasedAt: LOOKUP_PILOT_RELEASED_AT,
    tags: ['allergie', 'anaphylaxie', 'atemweg'],
    visibility: null,
    scope: null,
    searchTerms: ['anaphylaxie', 'allergie', 'adrenalin', 'schock'],
  },
  {
    id: 'alg-hypoglycemia' as AlgorithmId,
    title: 'Hypoglykaemie',
    summary: 'Diagnostik und Ersttherapie bei symptomatischer Unterzuckerung.',
    category: 'Internistisch',
    organizationId: LOOKUP_PILOT_ORGANIZATION_ID,
    regionId: null,
    stationId: null,
    currentReleasedVersionId: LOOKUP_PILOT_VERSION_ID,
    versionLabel: LOOKUP_PILOT_VERSION_LABEL,
    lastReleasedAt: LOOKUP_PILOT_RELEASED_AT,
    tags: ['stoffwechsel', 'glukose', 'bewusstsein'],
    visibility: null,
    scope: null,
    searchTerms: ['hypoglykaemie', 'unterzuckerung', 'glukose', 'bewusstseinsstoerung'],
  },
] as const;
