import type { PropsWithChildren } from "react";

type SectionFrameProps = PropsWithChildren<{
  id?: string;
  compact?: boolean;
}>;

export function SectionFrame({ children, id, compact = false }: SectionFrameProps) {
  const sectionClassName = compact ? "section-frame section-frame--compact" : "section-frame";

  return (
    <section id={id} className={sectionClassName}>
      {children}
    </section>
  );
}
