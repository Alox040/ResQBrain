export function createDose(input) {
    if (!input.amount.trim())
        throw new Error('Dose.amount is required');
    return Object.freeze({
        route: input.route,
        amount: input.amount.trim(),
        weightBased: Boolean(input.weightBased),
        ageGroup: input.ageGroup ?? null,
        maxDose: input.maxDose?.trim() || null,
        notes: input.notes?.trim() || null,
    });
}
