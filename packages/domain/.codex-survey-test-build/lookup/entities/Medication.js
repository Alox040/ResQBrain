export function createMedication(input) {
    if (!input.id.trim())
        throw new Error('Medication.id is required');
    if (!input.name.trim())
        throw new Error('Medication.name is required');
    if (!input.genericName.trim())
        throw new Error('Medication.genericName is required');
    const name = input.name.trim();
    const genericName = input.genericName.trim();
    const tradeNames = Object.freeze((input.tradeNames ?? []).map((t) => t.trim()).filter(Boolean));
    const searchTokens = Object.freeze([...new Set([name, genericName, ...tradeNames].map((s) => s.toLowerCase()))]);
    return Object.freeze({
        kind: 'Medication',
        id: input.id.trim(),
        name,
        genericName,
        tradeNames,
        doses: Object.freeze([...(input.doses ?? [])]),
        indications: Object.freeze([...(input.indications ?? [])]),
        contraindications: Object.freeze([...(input.contraindications ?? [])]),
        notes: input.notes?.trim() || null,
        version: input.version,
        searchTokens,
    });
}
