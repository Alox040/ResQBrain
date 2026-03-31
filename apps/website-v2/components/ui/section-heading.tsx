import type { CSSProperties } from "react";

import { typography } from "@/lib/design";

type SectionHeadingProps = {
  title: string;
  eyebrow?: string;
  className?: string;
};

export function SectionHeading({ title, eyebrow, className }: SectionHeadingProps) {
  const headingStyle: CSSProperties = {
    fontSize: typography.role.title.fontSize,
    fontWeight: typography.role.title.fontWeight,
    letterSpacing: typography.role.title.letterSpacing,
    lineHeight: typography.role.title.lineHeight,
    margin: 0,
  };

  const eyebrowStyle: CSSProperties = {
    fontSize: typography.role.eyebrow.fontSize,
    fontWeight: typography.role.eyebrow.fontWeight,
    letterSpacing: typography.role.eyebrow.letterSpacing,
    lineHeight: typography.role.eyebrow.lineHeight,
    margin: 0,
    textTransform: "uppercase",
  };

  return (
    <div className={className}>
      {eyebrow ? <p style={eyebrowStyle}>{eyebrow}</p> : null}
      <h2 style={headingStyle}>{title}</h2>
    </div>
  );
}
