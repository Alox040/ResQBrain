import type { CSSProperties, ReactNode } from "react";

import { typography } from "@/lib/design";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, subtitle, className, actions }: PageHeaderProps) {
  const headingStyle: CSSProperties = {
    fontSize: typography.role.pageTitle.fontSize,
    fontWeight: typography.role.pageTitle.fontWeight,
    letterSpacing: typography.role.pageTitle.letterSpacing,
    lineHeight: typography.role.pageTitle.lineHeight,
    margin: 0,
  };

  const subtitleStyle: CSSProperties = {
    color: "var(--text-muted, #4d5b76)",
    fontSize: typography.role.body.fontSize,
    fontWeight: typography.role.body.fontWeight,
    letterSpacing: typography.role.body.letterSpacing,
    lineHeight: typography.role.body.lineHeight,
    margin: 0,
  };

  return (
    <header className={className}>
      <h1 style={headingStyle}>{title}</h1>
      {subtitle ? <p style={subtitleStyle}>{subtitle}</p> : null}
      {actions}
    </header>
  );
}
