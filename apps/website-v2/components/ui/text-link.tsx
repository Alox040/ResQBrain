import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { designTokens, typography } from "@/lib/design";

type TextLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function TextLink({ href, children, className }: TextLinkProps) {
  const style: CSSProperties = {
    color: designTokens.color.accent,
    fontSize: typography.role.body.fontSize,
    fontWeight: typography.role.body.fontWeight,
    lineHeight: `${typography.role.body.lineHeight}`,
    textDecoration: "underline",
    textUnderlineOffset: "0.2em",
  };

  return (
    <Link className={className} href={href} style={style}>
      {children}
    </Link>
  );
}
