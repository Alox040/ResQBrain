export const designTokens = {
  color: {
    background: "#ffffff",
    surface: "#ffffff",
    surfaceMuted: "#f5f5f5",
    foreground: "#111111",
    textMuted: "#666666",
    border: "#dddddd",
    accent: "#111111",
    accentSoft: "#f0f0f0",
  },
  radius: {
    md: "0.5rem",
    lg: "0.75rem",
    pill: "999px",
  },
  borderWidth: {
    default: "1px",
  },
  shadow: {
    soft: "0 1px 2px rgba(0, 0, 0, 0.08)",
  },
} as const;

export const tokens = {
  colors: {
    background: designTokens.color.background,
    foreground: designTokens.color.foreground,
    border: designTokens.color.border,
  },
} as const;

export type DesignTokens = typeof designTokens;
