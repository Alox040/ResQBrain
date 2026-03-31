import type { PropsWithChildren } from "react";

type SectionFrameProps = PropsWithChildren<{
  id?: string;
  compact?: boolean;
}>;

export function SectionFrame({ children, id }: SectionFrameProps) {
  return <section id={id}>{children}</section>;
}
