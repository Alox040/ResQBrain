export const designTokens = {
  color: {
    text: "#172033",
    textMuted: "#4d5b76",
    textSubtle: "#6f7d96",
    background: "#f6f8fb",
    surface: "#ffffff",
    surfaceMuted: "#eef2f7",
    border: "#d7deea",
    borderStrong: "#c0cad9",
    accent: "#2f5e9e",
    accentSoft: "#e7f0fb",
  },
  radius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    pill: "999px",
  },
  borderWidth: {
    default: "1px",
    strong: "2px",
  },
  shadow: {
    soft: "0 8px 24px rgba(23, 32, 51, 0.06)",
    raised: "0 16px 40px rgba(23, 32, 51, 0.08)",
  },
} as const;

export type DesignTokens = typeof designTokens;
