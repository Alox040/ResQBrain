export interface LookupApiErrorPayload {
  error?: {
    code?: string;
    message?: string;
  };
}

export interface LookupAlgorithmListItem {
  id: string;
  title: string;
  summary?: string | null;
  category?: string | null;
  tags?: readonly string[];
  currentReleasedVersionId?: string | null;
}

export interface LookupAlgorithmDetail extends LookupAlgorithmListItem {}

export interface LookupMedicationListItem {
  id: string;
  name: string;
  summary?: string | null;
  category?: string | null;
  tags?: readonly string[];
  currentReleasedVersionId?: string | null;
}

export interface LookupMedicationDetail extends LookupMedicationListItem {}

export interface LookupSearchResultItem {
  id: string;
  title: string;
  summary?: string | null;
  tags?: readonly string[];
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

