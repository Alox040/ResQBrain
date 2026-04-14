import type { Contraindication } from '../src/lookup/entities/Contraindication';

export interface Medication {
  readonly kind: 'medication';
  readonly id: string;
  readonly label: string;
  readonly indication: string;
  readonly tags: ReadonlyArray<string>;
  readonly searchTerms: ReadonlyArray<string>;
  readonly notes: string | null;
  readonly genericName: string;
  readonly tradeNames: ReadonlyArray<string>;
  readonly dosage: string;
  readonly contraindications: ReadonlyArray<Contraindication>;
  readonly specialConsiderations: string | null;
  readonly relatedAlgorithmIds: ReadonlyArray<string>;
  readonly searchTokens: ReadonlyArray<string>;
}

export function createMedication(input: {
  id: string;
  label: string;
  indication: string;
  tags?: ReadonlyArray<string>;
  searchTerms?: ReadonlyArray<string>;
  notes?: string | null;
  genericName: string;
  tradeNames?: ReadonlyArray<string>;
  dosage: string;
  contraindications?: ReadonlyArray<Contraindication>;
  specialConsiderations?: string | null;
  relatedAlgorithmIds?: ReadonlyArray<string>;
}): Medication {
  if (!input.id.trim()) throw new Error('Medication.id is required');
  if (!input.label.trim()) throw new Error('Medication.label is required');
  if (!input.indication.trim()) throw new Error('Medication.indication is required');
  if (!input.genericName.trim()) throw new Error('Medication.genericName is required');
  if (!input.dosage.trim()) throw new Error('Medication.dosage is required');

  const label = input.label.trim();
  const indication = input.indication.trim();
  const genericName = input.genericName.trim();
  const tags = Object.freeze((input.tags ?? []).map((tag) => tag.trim()).filter(Boolean));
  const tradeNames = Object.freeze(
    (input.tradeNames ?? []).map((tradeName) => tradeName.trim()).filter(Boolean),
  );
  const searchTerms = Object.freeze(
    (input.searchTerms ?? []).map((term) => term.trim()).filter(Boolean),
  );

  const searchTokens = Object.freeze(
    [
      ...new Set(
        [label, indication, genericName, ...tradeNames, ...searchTerms].map((value) =>
          value.toLowerCase(),
        ),
      ),
    ],
  );

  return Object.freeze({
    kind: 'medication',
    id: input.id.trim(),
    label,
    indication,
    tags,
    searchTerms,
    notes: input.notes?.trim() || null,
    genericName,
    tradeNames,
    dosage: input.dosage.trim(),
    contraindications: Object.freeze([...(input.contraindications ?? [])]),
    specialConsiderations: input.specialConsiderations?.trim() || null,
    relatedAlgorithmIds: Object.freeze([...(input.relatedAlgorithmIds ?? [])]),
    searchTokens,
  });
}
