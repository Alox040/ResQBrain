/**
 * Version stamp für ein ContentBundle im Offline-Cache.
 *
 * Enthält nur das Minimum für Cache-Validierung:
 * wann wurde synchronisiert, welches Bundle ist geladen.
 */
export interface Version {
  /** Eindeutige Version-ID, z. B. "v1.4.2" oder ein UUID */
  readonly id: string;
  /** Zeitpunkt der Veröffentlichung (ISO-8601-String, JSON-serialisierbar) */
  readonly releasedAt: string;
  /** Optionaler Prüfwert für Integritätsprüfung beim Sync */
  readonly checksum: string | null;
}

export function createVersion(input: {
  id: string;
  releasedAt: string;
  checksum?: string | null;
}): Version {
  if (!input.id.trim()) throw new Error('Version.id is required');
  if (!input.releasedAt.trim()) throw new Error('Version.releasedAt is required');

  return Object.freeze({
    id: input.id.trim(),
    releasedAt: input.releasedAt.trim(),
    checksum: input.checksum?.trim() ?? null,
  });
}
