import type { CSSProperties, ReactNode } from "react";

import { designTokens, spacing, typography } from "@/lib/design";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className }: BadgeProps) {
  const style: CSSProperties = {
    backgroundColor: designTokens.color.accentSoft,
    border: `${designTokens.borderWidth.default} solid ${designTokens.color.border}`,
    borderRadius: designTokens.radius.pill,
    color: designTokens.color.textMuted,
    display: "inline-flex",
    fontSize: typography.role.eyebrow.fontSize,
    fontWeight: typography.role.eyebrow.fontWeight,
    letterSpacing: typography.role.eyebrow.letterSpacing,
    lineHeight: `${typography.role.eyebrow.lineHeight}`,
    paddingBlock: spacing.inline.tight,
    paddingInline: spacing.inline.default,
    textTransform: "uppercase",
  };

  return (
    <span className={className} style={style}>
      {children}
    </span>
  );
}
