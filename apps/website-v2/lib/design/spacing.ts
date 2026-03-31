export const spacingScale = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  "2xl": "2rem",
  "3xl": "3rem",
  "4xl": "4rem",
} as const;

export const spacing = {
  inline: {
    tight: spacingScale.sm,
    default: spacingScale.lg,
    roomy: spacingScale.xl,
  },
  stack: {
    tight: spacingScale.sm,
    default: spacingScale.lg,
    relaxed: spacingScale.xl,
    spacious: spacingScale["2xl"],
  },
  inset: {
    compact: spacingScale.lg,
    default: spacingScale.xl,
    roomy: spacingScale["2xl"],
  },
  section: {
    compact: spacingScale["2xl"],
    default: spacingScale["3xl"],
    spacious: spacingScale["4xl"],
  },
  gap: {
    card: spacingScale.lg,
    grid: spacingScale.xl,
    cluster: spacingScale.md,
  },
} as const;

export type SpacingScaleKey = keyof typeof spacingScale;
export type Spacing = typeof spacing;
