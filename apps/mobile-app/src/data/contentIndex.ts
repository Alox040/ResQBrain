import { algorithms } from '@/data/algorithms';
import { medications } from '@/data/medications';
import type { Algorithm, ContentItem, ContentKind, ContentListItem, Medication } from '@/types/content';

export type ContentKey = `${ContentKind}:${string}`;

export function toContentKey(kind: ContentKind, id: string): ContentKey {
  return `${kind}:${id}` as const;
}

export const contentItems: ContentItem[] = [...medications, ...algorithms];

export const contentLookup: Record<ContentKey, ContentItem> = Object.fromEntries(
  contentItems.map((item) => [toContentKey(item.kind, item.id), item]),
) as Record<ContentKey, ContentItem>;

export const searchItems: ContentListItem[] = contentItems.map((item) => ({
  id: item.id,
  kind: item.kind,
  label: item.label,
  subtitle: item.indication,
}));

export function getMedicationById(medicationId: string): Medication | undefined {
  const item = contentLookup[toContentKey('medication', medicationId)];
  return item?.kind === 'medication' ? item : undefined;
}

export function getAlgorithmById(algorithmId: string): Algorithm | undefined {
  const item = contentLookup[toContentKey('algorithm', algorithmId)];
  return item?.kind === 'algorithm' ? item : undefined;
}

