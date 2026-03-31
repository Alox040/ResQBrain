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
  variant?: "surface" | "band" | "survey";
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
  const isSurvey = variant === "survey";
  const bg = isSurvey
    ? ""
    : variant === "surface"
      ? "bg-[var(--color-surface)]"
      : "bg-[var(--color-band)]";
  const evenStyle =
    !isSurvey && even
      ? {
          background: `color-mix(in srgb, var(--ems-blue-soft) 25%, transparent)`,
          borderTop: `1px solid color-mix(in srgb, black 8%, transparent)`,
        }
      : undefined;
  const frameBorder = isSurvey
    ? "border border-solid border-[var(--primary)] bg-[#EFF6FF]"
    : "border-b border-[var(--color-border)]/80";
  return (
    <section
      id={id}
      className={`${scrollMarginUnderHeader} ${frameBorder} ${bg} ${sectionPaddingY}`.trim()}
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
