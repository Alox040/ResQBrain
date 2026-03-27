/**
 * Typography tokens — Werte sind mit `app/globals.css` (:root, .type-*) abgestimmt.
 * Inter wird in `app/layout.tsx` via `next/font` geladen; Geist Sans als benannter Fallback, falls lokal eingebunden.
 */

export const fontFamily = {
  sans: "var(--font-sans)",
} as const;

/** CSS-Klassen fuer konsistente Stile ohne Inline-Typo */
export const typeClass = {
  h1: "type-h1",
  h2: "type-h2",
  h3: "type-h3",
  body: "type-body",
  small: "type-small",
  caption: "type-caption",
} as const;

/** Vertikaler Rhythmus (CSS custom properties) */
export const rhythm = {
  /** 0.25rem — Raster-Basis */
  unit: "var(--rhythm-unit)",
  /** 0.5rem */
  xxs: "var(--rhythm-xxs)",
  /** 1rem */
  xs: "var(--rhythm-xs)",
  /** 1.5rem — eine „Zeile“ bei Body 1rem/1.5 */
  sm: "var(--rhythm-sm)",
  /** 2rem */
  md: "var(--rhythm-md)",
  /** 3rem */
  lg: "var(--rhythm-lg)",
  /** 4rem */
  xl: "var(--rhythm-xl)",
} as const;

/** Fuer `style={{ ...typographyScale.h2 }}` in TSX */
export const typographyScale = {
  h1: {
    fontFamily: fontFamily.sans,
    fontSize: "var(--text-h1-size)",
    lineHeight: "var(--text-h1-line)",
    fontWeight: "var(--text-h1-weight)",
    letterSpacing: "var(--text-h1-track)",
  },
  h2: {
    fontFamily: fontFamily.sans,
    fontSize: "var(--text-h2-size)",
    lineHeight: "var(--text-h2-line)",
    fontWeight: "var(--text-h2-weight)",
    letterSpacing: "var(--text-h2-track)",
  },
  h3: {
    fontFamily: fontFamily.sans,
    fontSize: "var(--text-h3-size)",
    lineHeight: "var(--text-h3-line)",
    fontWeight: "var(--text-h3-weight)",
    letterSpacing: "var(--text-h3-track)",
  },
  body: {
    fontFamily: fontFamily.sans,
    fontSize: "var(--text-body-size)",
    lineHeight: "var(--text-body-line)",
    fontWeight: "var(--text-body-weight)",
  },
  small: {
    fontFamily: fontFamily.sans,
    fontSize: "var(--text-small-size)",
    lineHeight: "var(--text-small-line)",
    fontWeight: "var(--text-small-weight)",
  },
  caption: {
    fontFamily: fontFamily.sans,
    fontSize: "var(--text-caption-size)",
    lineHeight: "var(--text-caption-line)",
    fontWeight: "var(--text-caption-weight)",
    color: "var(--text-caption-color)",
  },
} as const;

export type TypographyRole = keyof typeof typographyScale;
