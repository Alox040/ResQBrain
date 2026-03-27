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

export type MockAlgorithmItem = MockContentBase & {
  kind: 'algorithm';
  steps: string[];
};

export const mockAlgorithms: MockAlgorithmItem[] = [
  {
    id: 'alg-reanimation',
    kind: 'algorithm',
    title: 'Reanimation',
    indication: 'Kreislaufstillstand mit sofortigem Basisablauf.',
    tags: ['kreislauf'],
    searchTerms: ['reanimation', 'cpr', 'als', 'herzstillstand'],
    hints: ['Lokale SOP hat Vorrang.', 'Keine Echtzeit-Entscheidungshilfe.'],
    sources: ['ERC ALS Guideline (statischer Mock)'],
    steps: [
      'Sicherheit, Bewusstsein und Atmung pruefen.',
      'Team alarmieren und Defibrillator anfordern.',
      'Thoraxkompressionen 30:2 starten.',
      'Rhythmus analysieren und gemaess Schema handeln.',
    ],
  },
  {
    id: 'alg-anaphylaxie',
    kind: 'algorithm',
    title: 'Anaphylaxie',
    indication: 'Schwere allergische Reaktion mit Atemwegs- oder Kreislaufbeteiligung.',
    tags: ['atemwege', 'kreislauf'],
    searchTerms: ['anaphylaxie', 'allergie', 'schock'],
    hints: ['Adrenalin nicht verzoegern.', 'Verschlechterung frueh eskalieren.'],
    sources: ['S2k Leitlinie Anaphylaxie (statischer Mock)'],
    steps: [
      'Ausloeser entfernen und Oxygenierung starten.',
      'Adrenalin 0.5 mg i.m. lateral in den Oberschenkel geben.',
      'Volumen bei Hypotonie geben.',
      'Verlauf engmaschig ueberwachen.',
    ],
  },
  {
    id: 'alg-hypoglykaemie',
    kind: 'algorithm',
    title: 'Hypoglykaemie',
    indication: 'Symptomatische Unterzuckerung mit klinischer Relevanz.',
    tags: ['stoffwechsel'],
    searchTerms: ['hypoglykaemie', 'unterzucker', 'blutzucker'],
    hints: ['Nach Gabe BZ erneut messen.', 'Persistierende Symptome abklaeren.'],
    sources: ['Diabetes Notfallstandard (statischer Mock)'],
    steps: [
      'Blutzucker messen und Monitoring starten.',
      'Bei gesicherter Hypoglykaemie Glukose i.v. geben.',
      'Vigilanz und klinischen Verlauf reevaluieren.',
      'Sicheren Transport organisieren.',
    ],
  },
];
