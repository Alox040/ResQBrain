export interface LookupApiErrorPayload {
  error?: {
    code?: string;
    message?: string;
  };
}

export interface LookupScopedContentRecord {
  id: string;
  summary?: string | null;
  category?: string | null;
  organizationId: string;
  regionId?: string | null;
  stationId?: string | null;
  currentReleasedVersionId: string;
  versionLabel?: string | null;
  lastReleasedAt?: string | null;
  tags?: readonly string[];
  visibility?: string | null;
  scope?: string | null;
}

export interface LookupAlgorithmListItem extends LookupScopedContentRecord {
  id: string;
  title: string;
}

export interface LookupAlgorithmDetail extends LookupScopedContentRecord {
  id: string;
  title: string;
}

export interface LookupMedicationListItem extends LookupScopedContentRecord {
  id: string;
  name: string;
}

export interface LookupMedicationDetail extends LookupScopedContentRecord {
  id: string;
  name: string;
}

export interface LookupSearchResultItem extends LookupScopedContentRecord {
  id: string;
  title: string;
  kind?: 'algorithm' | 'medication';
}

export interface LookupSearchResponse {
  readonly items: LookupSearchResultItem[];
  readonly page: number;
  readonly limit: number;
}

export interface LookupListResponse<TItem> {
  items: TItem[];
  page: number;
  limit: number;
}

export type LookupAlgorithmsResponse = LookupListResponse<LookupAlgorithmListItem>;
export type LookupMedicationsResponse = LookupListResponse<LookupMedicationListItem>;
