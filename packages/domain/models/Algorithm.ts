export interface AlgorithmStep {
  readonly position: number;
  readonly instruction: string;
  readonly notes: string | null;
}

export interface Algorithm {
  readonly kind: 'algorithm';
  readonly id: string;
  readonly label: string;
  readonly indication: string;
  readonly tags: ReadonlyArray<string>;
  readonly searchTerms: ReadonlyArray<string>;
  readonly notes: string | null;
  readonly category: string;
  readonly steps: ReadonlyArray<AlgorithmStep>;
  readonly warnings: string | null;
  readonly relatedMedicationIds: ReadonlyArray<string>;
  readonly searchTokens: ReadonlyArray<string>;
}

export function createAlgorithmStep(input: {
  position: number;
  instruction: string;
  notes?: string | null;
}): AlgorithmStep {
  if (input.position < 1) throw new Error('AlgorithmStep.position must be >= 1');
  if (!input.instruction.trim()) throw new Error('AlgorithmStep.instruction is required');

  return Object.freeze({
    position: input.position,
    instruction: input.instruction.trim(),
    notes: input.notes?.trim() || null,
  });
}

export function createAlgorithm(input: {
  id: string;
  label: string;
  indication: string;
  tags?: ReadonlyArray<string>;
  searchTerms?: ReadonlyArray<string>;
  notes?: string | null;
  category: string;
  steps?: ReadonlyArray<AlgorithmStep>;
  warnings?: string | null;
  relatedMedicationIds?: ReadonlyArray<string>;
}): Algorithm {
  if (!input.id.trim()) throw new Error('Algorithm.id is required');
  if (!input.label.trim()) throw new Error('Algorithm.label is required');
  if (!input.indication.trim()) throw new Error('Algorithm.indication is required');
  if (!input.category.trim()) throw new Error('Algorithm.category is required');

  const label = input.label.trim();
  const indication = input.indication.trim();
  const category = input.category.trim();
  const tags = Object.freeze((input.tags ?? []).map((tag) => tag.trim()).filter(Boolean));
  const searchTerms = Object.freeze(
    (input.searchTerms ?? []).map((term) => term.trim()).filter(Boolean),
  );
  const steps = Object.freeze(
    [...(input.steps ?? [])].sort((left, right) => left.position - right.position),
  );

  const searchTokens = Object.freeze(
    [
      ...new Set(
        [label, indication, category, ...searchTerms].map((value) => value.toLowerCase()),
      ),
    ],
  );

  return Object.freeze({
    kind: 'algorithm',
    id: input.id.trim(),
    label,
    indication,
    tags,
    searchTerms,
    notes: input.notes?.trim() || null,
    category,
    steps,
    warnings: input.warnings?.trim() || null,
    relatedMedicationIds: Object.freeze([...(input.relatedMedicationIds ?? [])]),
    searchTokens,
  });
}
