import type { PropsWithChildren } from "react";

type ContainerProps = PropsWithChildren<{
  maxWidth?: "narrow" | "content" | "wide";
}>;

export function Container({ children }: ContainerProps) {
  return <div>{children}</div>;
}
