export function createVersion(input) {
    if (!input.id.trim())
        throw new Error('Version.id is required');
    if (!input.releasedAt.trim())
        throw new Error('Version.releasedAt is required');
    return Object.freeze({
        id: input.id.trim(),
        releasedAt: input.releasedAt.trim(),
        checksum: input.checksum?.trim() ?? null,
    });
}
