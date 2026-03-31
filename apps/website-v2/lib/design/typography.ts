const baseText = {
  fontWeight: 400,
  letterSpacing: "0",
};

export const typography = {
  fontFamily: "sans-serif",
  fontSize: {
    body: "1rem",
    heading: "2rem",
  },
  role: {
    eyebrow: {
      ...baseText,
      fontSize: "0.75rem",
      lineHeight: 1.2,
      fontWeight: 600,
      letterSpacing: "0.08em",
    },
    label: {
      ...baseText,
      fontSize: "0.95rem",
      lineHeight: 1.3,
      fontWeight: 600,
    },
    body: {
      ...baseText,
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    title: {
      ...baseText,
      fontSize: "1.75rem",
      lineHeight: 1.2,
      fontWeight: 700,
    },
    pageTitle: {
      ...baseText,
      fontSize: "2.25rem",
      lineHeight: 1.1,
      fontWeight: 700,
    },
  },
} as const;

export type Typography = typeof typography;
export type TypographyRoleKey = keyof typeof typography.role;
