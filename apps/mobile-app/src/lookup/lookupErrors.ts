export type LookupErrorCode =
  | 'LOOKUP_EMBEDDED_BUNDLE_MISSING'
  | 'LOOKUP_BUNDLE_INVALID'
  | 'LOOKUP_CONTENT_STORE_EMPTY'
  | 'LOOKUP_CONTENT_STORE_NOT_READY'
  | 'LOOKUP_CONTENT_INITIALIZATION_FAILED'
  | 'LOOKUP_CONTENT_ITEM_NOT_FOUND';

export class LookupContentError extends Error {
  readonly code: LookupErrorCode;
  readonly details?: readonly string[];
  readonly cause?: unknown;

  constructor(args: {
    code: LookupErrorCode;
    message: string;
    details?: readonly string[];
    cause?: unknown;
  }) {
    super(args.message);
    this.name = 'LookupContentError';
    this.code = args.code;
    this.details = args.details;
    this.cause = args.cause;
  }
}

export function isLookupContentError(error: unknown): error is LookupContentError {
  return error instanceof LookupContentError;
}

export type LookupUiErrorState = {
  message: string;
  hint: string;
};

export function toLookupUiErrorState(error: unknown): LookupUiErrorState {
  if (!isLookupContentError(error)) {
    if (error instanceof Error && error.message.trim().length > 0) {
      return {
        message: 'Inhalte konnten nicht geladen werden.',
        hint: error.message,
      };
    }

    return {
      message: 'Inhalte konnten nicht geladen werden.',
      hint: 'Bitte erneut versuchen oder die App neu starten.',
    };
  }

  switch (error.code) {
    case 'LOOKUP_EMBEDDED_BUNDLE_MISSING':
      return {
        message: 'Inhalte konnten nicht geladen werden.',
        hint: 'Das eingebettete Inhalts-Bundle fehlt. App-Bundle pruefen und neu installieren.',
      };
    case 'LOOKUP_BUNDLE_INVALID':
      return {
        message: 'Inhalte konnten nicht geladen werden.',
        hint: 'Das eingebettete Inhalts-Bundle ist ungueltig. Bundle-Erzeugung oder App-Bundle pruefen.',
      };
    case 'LOOKUP_CONTENT_STORE_EMPTY':
      return {
        message: 'Inhalte konnten nicht geladen werden.',
        hint: 'Das lokale Inhalts-Bundle enthaelt keine Eintraege. Bundle-Inhalt pruefen.',
      };
    case 'LOOKUP_CONTENT_STORE_NOT_READY':
      return {
        message: 'Inhalte werden noch vorbereitet.',
        hint: 'Bitte erneut versuchen. Wenn das Problem bleibt, App neu starten.',
      };
    case 'LOOKUP_CONTENT_INITIALIZATION_FAILED':
      return {
        message: 'Inhalte konnten nicht geladen werden.',
        hint: 'Die lokale Initialisierung ist fehlgeschlagen. Bitte erneut versuchen oder App neu starten.',
      };
    case 'LOOKUP_CONTENT_ITEM_NOT_FOUND':
      return {
        message: 'Eintrag nicht gefunden.',
        hint: 'Die angeforderte ID ist im lokalen Inhalts-Bundle nicht vorhanden.',
      };
    default:
      return {
        message: 'Inhalte konnten nicht geladen werden.',
        hint: 'Bitte erneut versuchen oder die App neu starten.',
      };
  }
}
