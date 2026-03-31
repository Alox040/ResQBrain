import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { designTokens, spacing, typography } from "@/lib/design";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function ButtonLink({ href, children, className }: ButtonLinkProps) {
  const style: CSSProperties = {
    alignItems: "center",
    backgroundColor: designTokens.color.accent,
    border: `${designTokens.borderWidth.default} solid ${designTokens.color.accent}`,
    borderRadius: designTokens.radius.pill,
    color: "#ffffff",
    display: "inline-flex",
    fontSize: typography.role.label.fontSize,
    fontWeight: typography.role.label.fontWeight,
    gap: spacing.gap.cluster,
    lineHeight: `${typography.role.label.lineHeight}`,
    paddingBlock: spacing.inline.tight,
    paddingInline: spacing.inset.default,
    textDecoration: "none",
  };

  return (
    <Link className={className} href={href} style={style}>
      {children}
    </Link>
  );
}
