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
  even?: boolean;
  description?: ReactNode;
  children?: ReactNode;
};

export function SectionFrame({
  id,
  eyebrow,
  title,
  variant = "band",
  even = false,
  description,
  children,
}: SectionFrameProps) {
  const bg =
    variant === "surface" ? "bg-[var(--color-surface)]" : "bg-[var(--color-band)]";
  const evenStyle = even
    ? {
        background: `color-mix(in srgb, var(--ems-blue-soft) 25%, transparent)`,
        borderTop: `1px solid color-mix(in srgb, black 8%, transparent)`,
      }
    : undefined;
  return (
    <section
      id={id}
      className={`${scrollMarginUnderHeader} border-b border-[var(--color-border)]/80 ${bg} ${sectionPaddingY}`}
      style={evenStyle}
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
