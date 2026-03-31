export const layout = {
  width: {
    narrow: "var(--container-narrow)",
    content: "var(--container-content)",
    wide: "var(--container-wide)",
  },
  container: {
    paddingInline: "var(--container-padding)",
  },
  section: {
    paddingBlock: "var(--section-space)",
    paddingBlockCompact: "var(--section-space-compact)",
  },
  card: {
    padding: "var(--card-padding)",
    radius: "var(--radius-card)",
    borderWidth: "var(--border-width)",
  },
  button: {
    minHeight: "var(--button-height)",
    paddingInline: "var(--button-padding-inline)",
    radius: "var(--radius-control)",
  },
} as const;

export type Layout = typeof layout;
