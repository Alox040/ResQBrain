import { designTokens } from "@/lib/design/tokens";

export const surfaces = {
  canvas: {
    backgroundColor: designTokens.color.background,
    borderColor: "transparent",
    borderWidth: "0",
    borderRadius: "0",
    boxShadow: "none",
  },
  base: {
    backgroundColor: designTokens.color.surface,
    borderColor: designTokens.color.border,
    borderWidth: designTokens.borderWidth.default,
    borderRadius: designTokens.radius.md,
    boxShadow: "none",
  },
  muted: {
    backgroundColor: designTokens.color.surfaceMuted,
    borderColor: designTokens.color.border,
    borderWidth: designTokens.borderWidth.default,
    borderRadius: designTokens.radius.md,
    boxShadow: "none",
  },
  raised: {
    backgroundColor: designTokens.color.surface,
    borderColor: designTokens.color.border,
    borderWidth: designTokens.borderWidth.default,
    borderRadius: designTokens.radius.lg,
    boxShadow: designTokens.shadow.soft,
  },
} as const;

export type SurfaceKey = keyof typeof surfaces;
export type Surface = typeof surfaces;
