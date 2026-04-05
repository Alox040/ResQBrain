import type { ContentCategory } from '@/types/content';

/** UI filter including “show everything”. */
export type ListCategoryFilter = 'all' | ContentCategory;

export const LIST_CATEGORY_CHIP_OPTIONS: readonly {
  value: ListCategoryFilter;
  label: string;
}[] = [
  { value: 'all', label: 'All' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'trauma', label: 'Trauma' },
  { value: 'sepsis', label: 'Sepsis' },
  { value: 'resuscitation', label: 'Reanimation' },
] as const;

/** Display label for a bundle `category` field (chips / detail hero). */
export function labelForContentCategory(
  category: ContentCategory | undefined,
): string | null {
  if (category == null) return null;
  const found = LIST_CATEGORY_CHIP_OPTIONS.find((o) => o.value === category);
  return found?.label ?? null;
}

export function filterByListCategory<T extends { category?: ContentCategory }>(
  items: T[],
  filter: ListCategoryFilter,
): T[] {
  if (filter === 'all') {
    return items;
  }
  return items.filter((item) => item.category === filter);
}
