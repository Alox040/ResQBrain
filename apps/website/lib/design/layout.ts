export const layout = {
  width: {
    narrow: "var(--container-narrow)",
    content: "var(--container-content)",
    wide: "var(--container-wide)",
    hero: "var(--container-hero)",
  },
  container: {
    paddingInline: "var(--container-padding)",
  },
  section: {
    paddingBlockHero: "var(--section-space-hero)",
    paddingBlock: "var(--section-space)",
    paddingBlockCompact: "var(--section-space-compact)",
  },
  card: {
    padding: "var(--card-padding)",
    radius: "var(--radius-card)",
    borderWidth: "var(--border-width)",
    variants: {
      subtle: "var(--surface-subtle)",
      accent: "var(--accent-subtle)",
    },
  },
  button: {
    minHeight: "var(--button-height)",
    minHeightLarge: "var(--button-height-lg)",
    paddingInline: "var(--button-padding-inline)",
    paddingInlineLarge: "var(--button-padding-inline-lg)",
    radius: "var(--radius-control)",
  },
} as const;

export type Layout = typeof layout;
