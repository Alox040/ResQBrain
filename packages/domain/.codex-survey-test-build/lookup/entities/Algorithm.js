export function createAlgorithmStep(input) {
    if (input.position < 1)
        throw new Error('AlgorithmStep.position must be >= 1');
    if (!input.instruction.trim())
        throw new Error('AlgorithmStep.instruction is required');
    return Object.freeze({
        position: input.position,
        instruction: input.instruction.trim(),
        condition: input.condition?.trim() || null,
        medicationIds: Object.freeze([...(input.medicationIds ?? [])]),
        notes: input.notes?.trim() || null,
    });
}
export function createAlgorithm(input) {
    if (!input.id.trim())
        throw new Error('Algorithm.id is required');
    if (!input.name.trim())
        throw new Error('Algorithm.name is required');
    if (!input.category.trim())
        throw new Error('Algorithm.category is required');
    const name = input.name.trim();
    const category = input.category.trim();
    const steps = Object.freeze([...(input.steps ?? [])].sort((a, b) => a.position - b.position));
    const searchTokens = Object.freeze([...new Set([name, category].map((s) => s.toLowerCase()))]);
    return Object.freeze({
        kind: 'Algorithm',
        id: input.id.trim(),
        name,
        category,
        indications: Object.freeze([...(input.indications ?? [])]),
        steps,
        notes: input.notes?.trim() || null,
        version: input.version,
        searchTokens,
    });
}
