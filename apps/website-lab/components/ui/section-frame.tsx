import type { PropsWithChildren } from "react";

type SectionFrameProps = PropsWithChildren<{
  tone?: "default" | "soft" | "accent";
}>;

export function SectionFrame({ children, tone = "default" }: SectionFrameProps) {
  return <div className={`section-frame section-frame--${tone}`}>{children}</div>;
}
