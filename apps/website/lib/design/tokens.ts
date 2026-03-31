export const colorTokens = {
  background: "var(--background)",
  surface: "var(--surface)",
  surfaceSubtle: "var(--surface-subtle)",
  border: "var(--border)",
  text: "var(--text)",
  mutedText: "var(--text-muted)",
  accent: "var(--accent)",
  accentStrong: "var(--accent-strong)",
  accentSubtle: "var(--accent-subtle)",
  onAccent: "var(--on-accent)",
} as const;

export const shapeTokens = {
  borderWidth: "var(--border-width)",
  radiusCard: "var(--radius-card)",
  radiusControl: "var(--radius-control)",
} as const;

export const designTokens = {
  color: colorTokens,
  shape: shapeTokens,
} as const;

export type ColorTokenKey = keyof typeof colorTokens;
export type DesignTokens = typeof designTokens;
