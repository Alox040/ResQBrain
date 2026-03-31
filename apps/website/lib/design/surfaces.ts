import { designTokens } from "@/lib/design/tokens";

export const surfaces = {
  canvas: {
    backgroundColor: designTokens.color.background,
    borderColor: "transparent",
    borderWidth: "0",
    borderRadius: "0",
  },
  base: {
    backgroundColor: designTokens.color.surface,
    borderColor: designTokens.color.border,
    borderWidth: designTokens.shape.borderWidth,
    borderRadius: designTokens.shape.radiusCard,
  },
  subtle: {
    backgroundColor: designTokens.color.surfaceSubtle,
    borderColor: designTokens.color.border,
    borderWidth: designTokens.shape.borderWidth,
    borderRadius: designTokens.shape.radiusCard,
  },
} as const;

export type SurfaceKey = keyof typeof surfaces;
export type Surface = typeof surfaces;
