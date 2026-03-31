import type { PropsWithChildren } from "react";

type ContainerProps = PropsWithChildren<{
  maxWidth?: "narrow" | "content" | "wide";
}>;

export function Container({ children, maxWidth = "content" }: ContainerProps) {
  return <div className={`container container--${maxWidth}`}>{children}</div>;
}
