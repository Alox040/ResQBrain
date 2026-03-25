import type { AppendOnlyHistory } from '../common/audit';
import type {
  SurveyConfidence,
  SurveyInsightType,
  SurveyTargetEntityType,
} from '../common/enums';
import type {
  CountyId,
  OrganizationId,
  RegionId,
  StationId,
  SurveyInsightId,
} from '../common/ids';

export interface SurveyInsight {
  readonly id: SurveyInsightId;
  readonly organizationId: OrganizationId;
  readonly regionId?: RegionId | null;
  readonly countyId?: CountyId | null;
  readonly stationId?: StationId | null;
  readonly targetEntityType: SurveyTargetEntityType;
  readonly targetEntityId?: string | null;
  readonly insightType: SurveyInsightType;
  readonly value: number;
  readonly confidence: SurveyConfidence;
  readonly sourceRef: string;
  readonly importedAt: string;
  readonly versionWindow?: string;
  readonly rawPayload?: Readonly<Record<string, unknown>>;
  readonly governanceLocked: true;
  readonly appendOnlyHistory: true;
}

export type SurveyInsightHistory = AppendOnlyHistory<SurveyInsight>;
