import type { PropsWithChildren } from "react";

type ContentCardProps = PropsWithChildren<{
  variant?: "default" | "subtle" | "accent";
  interactive?: boolean;
  className?: string;
}>;

export function ContentCard({
  children,
  variant = "default",
  interactive = false,
  className,
}: ContentCardProps) {
  const cardClassName = [
    "card",
    variant === "subtle" ? "card--subtle" : "",
    variant === "accent" ? "card--accent" : "",
    interactive ? "card--interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={cardClassName}>{children}</div>;
}
