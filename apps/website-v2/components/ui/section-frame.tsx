import type { CSSProperties, ReactNode } from "react";

import { layout } from "@/lib/design";

type SectionFrameProps = {
  children: ReactNode;
  className?: string;
  compact?: boolean;
};

export function SectionFrame({ children, className, compact = false }: SectionFrameProps) {
  const style: CSSProperties = {
    display: "grid",
    gap: layout.section.gap,
    paddingBlock: compact ? layout.section.paddingBlockCompact : layout.section.paddingBlock,
  };

  return (
    <section className={className} style={style}>
      {children}
    </section>
  );
}
