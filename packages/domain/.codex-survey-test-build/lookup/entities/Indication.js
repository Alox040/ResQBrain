export function createIndication(input) {
    if (!input.text.trim())
        throw new Error('Indication.text is required');
    return Object.freeze({
        text: input.text.trim(),
        category: input.category?.trim() || null,
    });
}
