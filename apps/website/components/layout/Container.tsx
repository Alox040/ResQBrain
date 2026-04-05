import type { PropsWithChildren } from "react";

export type ContainerWidth = "narrow" | "content" | "wide" | "hero";

type ContainerProps = PropsWithChildren<{
  className?: string;
  maxWidth?: ContainerWidth;
}>;

export function Container({ children, className, maxWidth = "content" }: ContainerProps) {
  const widthClass = maxWidth === "content" ? "container" : `container container--${maxWidth}`;

  return <div className={[widthClass, className].filter(Boolean).join(" ")}>{children}</div>;
}
