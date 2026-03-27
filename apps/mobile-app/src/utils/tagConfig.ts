import type { ContentTag } from '@/types/content';

type TagConfig = {
  label: string;
  backgroundColor: string;
  textColor: string;
};

export const TAG_CONFIG: Record<ContentTag, TagConfig> = {
  kreislauf:    { label: 'Kreislauf',    backgroundColor: '#fee2e2', textColor: '#dc2626' },
  atemwege:     { label: 'Atemwege',     backgroundColor: '#e0f2fe', textColor: '#0284c7' },
  neurologie:   { label: 'Neurologie',   backgroundColor: '#ede9fe', textColor: '#7c3aed' },
  analgesie:    { label: 'Analgesie',    backgroundColor: '#fef9c3', textColor: '#ca8a04' },
  intoxikation: { label: 'Intoxikation', backgroundColor: '#ffedd5', textColor: '#ea580c' },
  stoffwechsel: { label: 'Stoffwechsel', backgroundColor: '#d1fae5', textColor: '#059669' },
};
