import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import {
  eyebrowClass,
  sectionChildrenClass,
  sectionLeadClass,
  sectionPaddingY,
  sectionTitleClass,
  scrollMarginUnderHeader,
} from "@/components/ui/patterns";

export type SectionFrameProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  variant?: "surface" | "band";
  description?: ReactNode;
  children?: ReactNode;
};

export function SectionFrame({
  id,
  eyebrow,
  title,
  variant = "band",
  description,
  children,
}: SectionFrameProps) {
  const bg =
    variant === "surface" ? "bg-[var(--color-surface)]" : "bg-[var(--color-band)]";
  return (
    <section
      id={id}
      className={`${scrollMarginUnderHeader} border-b border-[var(--color-border)]/80 ${bg} ${sectionPaddingY}`}
    >
      <Container>
        {eyebrow ? <p className={eyebrowClass}>{eyebrow}</p> : null}
        <h2 className={sectionTitleClass}>{title}</h2>
        {description ? <div className={sectionLeadClass}>{description}</div> : null}
        {children ? <div className={`${sectionChildrenClass} w-full`}>{children}</div> : null}
      </Container>
    </section>
  );
}
