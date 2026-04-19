export const typography = {
  family: {
    sans: "var(--font-family-sans)",
  },
  role: {
    heroTitle: {
      fontSize: "var(--font-hero-title)",
      fontWeight: "var(--font-weight-semibold)",
      letterSpacing: "var(--letter-spacing-tight)",
      lineHeight: "var(--line-height-display)",
    },
    sectionTitle: {
      fontSize: "var(--font-section-title)",
      fontWeight: "var(--font-weight-semibold)",
      letterSpacing: "var(--letter-spacing-heading)",
      lineHeight: "var(--line-height-heading)",
    },
    subheadline: {
      fontSize: "var(--font-subheadline)",
      fontWeight: "var(--font-weight-regular)",
      letterSpacing: "var(--letter-spacing-body)",
      lineHeight: "var(--line-height-body-relaxed)",
    },
    body: {
      fontSize: "var(--font-body)",
      fontWeight: "var(--font-weight-regular)",
      letterSpacing: "var(--letter-spacing-body)",
      lineHeight: "var(--line-height-body)",
    },
    small: {
      fontSize: "var(--font-small)",
      fontWeight: "var(--font-weight-medium)",
      letterSpacing: "0",
      lineHeight: "var(--line-height-small)",
    },
  },
} as const;

export type Typography = typeof typography;
export type TypographyRoleKey = keyof typeof typography.role;
