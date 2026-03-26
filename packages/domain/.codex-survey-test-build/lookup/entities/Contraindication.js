export function createContraindication(input) {
    if (!input.text.trim())
        throw new Error('Contraindication.text is required');
    return Object.freeze({
        text: input.text.trim(),
        severity: input.severity,
        notes: input.notes?.trim() || null,
    });
}
