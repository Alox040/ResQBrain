export const typography = {
  fontFamily: {
    sans: "var(--font-sans, system-ui, sans-serif)",
    mono: "var(--font-mono, ui-monospace, monospace)",
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.15,
    snug: 1.25,
    body: 1.6,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: "-0.02em",
    normal: "0",
    wide: "0.04em",
  },
  size: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "2rem",
    "4xl": "2.5rem",
  },
  role: {
    eyebrow: {
      fontSize: "0.75rem",
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: "0.04em",
    },
    bodySm: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: "0",
    },
    body: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: "0",
    },
    bodyLg: {
      fontSize: "1.125rem",
      fontWeight: 400,
      lineHeight: 1.7,
      letterSpacing: "0",
    },
    label: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: "0",
    },
    titleSm: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: "-0.02em",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    pageTitle: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.15,
      letterSpacing: "-0.02em",
    },
  },
} as const;

export type Typography = typeof typography;
export type TypographyRoleKey = keyof typeof typography.role;
