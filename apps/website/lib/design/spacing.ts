export const spacing = {
  1: "var(--space-1)",
  2: "var(--space-2)",
  3: "var(--space-3)",
  4: "var(--space-4)",
  5: "var(--space-5)",
  6: "var(--space-6)",
  7: "var(--space-7)",
  8: "var(--space-8)",
  9: "var(--space-9)",
  inline: {
    compact: "var(--space-3)",
    default: "var(--space-4)",
    comfortable: "var(--space-5)",
  },
  stack: {
    sm: "var(--space-3)",
    md: "var(--space-4)",
    lg: "var(--space-5)",
  },
  section: {
    compact: "var(--section-space-compact)",
    default: "var(--section-space)",
  },
} as const;

export type Spacing = typeof spacing;
export type SpacingScaleKey = keyof typeof spacing;
