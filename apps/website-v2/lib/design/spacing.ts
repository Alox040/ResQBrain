export const spacing = {
  xs: "0.5rem",
  sm: "1rem",
  md: "1.5rem",
  lg: "2rem",
  inline: {
    tight: "0.375rem",
    default: "0.75rem",
  },
  inset: {
    compact: "1rem",
    default: "1.5rem",
  },
  stack: {
    tight: "0.5rem",
    default: "1rem",
    relaxed: "1.5rem",
  },
  section: {
    compact: "2rem",
    default: "3rem",
  },
  gap: {
    cluster: "0.5rem",
  },
} as const;

export const spacingScale = spacing;

export type Spacing = typeof spacing;
export type SpacingScaleKey = keyof typeof spacing;
