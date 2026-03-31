import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, subtitle, className, actions }: PageHeaderProps) {
  return (
    <header className={["stack stack--md", className].filter(Boolean).join(" ")}>
      <h1 className="page-title">{title}</h1>
      {subtitle ? <p className="body-text muted-text">{subtitle}</p> : null}
      {actions}
    </header>
  );
}
