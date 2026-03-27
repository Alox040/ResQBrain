import type { ContentTag } from '@/types/content';

type MockContentBase = {
  id: string;
  kind: 'medication' | 'algorithm';
  title: string;
  indication: string;
  tags: ContentTag[];
  searchTerms: string[];
  hints: string[];
  sources: string[];
};

export type MockMedicationItem = MockContentBase & {
  kind: 'medication';
  dosage: string;
};

export const mockMedications: MockMedicationItem[] = [
  {
    id: 'med-adrenalin',
    kind: 'medication',
    title: 'Adrenalin',
    indication: 'Kreislaufstillstand und schwere Anaphylaxie.',
    tags: ['kreislauf', 'atemwege'],
    searchTerms: ['adrenalin', 'epinephrin', 'epi'],
    hints: ['Lokale SOP beachten.', 'Gabe und Wirkung dokumentieren.'],
    sources: ['ALS Standard (statischer Mock)'],
    dosage: '1 mg i.v./i.o. alle 3-5 Minuten (Reanimation).',
  },
  {
    id: 'med-amiodaron',
    kind: 'medication',
    title: 'Amiodaron',
    indication: 'Therapierefraktaere VF/VT im ALS Kontext.',
    tags: ['kreislauf'],
    searchTerms: ['amiodaron', 'vf', 'vt', 'antiarrhythmikum'],
    hints: ['Nur nach lokalem Schema geben.', 'Verlauf engmaschig beobachten.'],
    sources: ['ALS Standard (statischer Mock)'],
    dosage: '300 mg i.v./i.o. nach 3. Schock.',
  },
  {
    id: 'med-salbutamol',
    kind: 'medication',
    title: 'Salbutamol',
    indication: 'Bronchospasmus bei Asthma oder COPD Exazerbation.',
    tags: ['atemwege'],
    searchTerms: ['salbutamol', 'ventolin', 'bronchospasmus'],
    hints: ['Wirkung klinisch reevaluieren.', 'Tremor und Puls beobachten.'],
    sources: ['Atemwegsstandard (statischer Mock)'],
    dosage: '2.5-5 mg vernebelt, Wiederholung nach Bedarf.',
  },
];
