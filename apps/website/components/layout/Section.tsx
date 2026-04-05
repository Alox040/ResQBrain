import type { CSSProperties, PropsWithChildren } from "react";

import { Container } from "@/components/layout/Container";

type SectionBackground = "none" | "surface" | "subtle";

type SectionProps = PropsWithChildren<{
  id?: string;
  className?: string;
  background?: SectionBackground;
  containerClassName?: string;
  containerMaxWidth?: number;
}>;

const backgroundMap: Record<SectionBackground, string> = {
  none: "transparent",
  surface: "var(--surface)",
  subtle: "var(--surface-subtle)",
};

export function Section({
  children,
  id,
  className,
  background = "none",
  containerClassName,
  containerMaxWidth,
}: SectionProps) {
  const style: CSSProperties = {
    backgroundColor: backgroundMap[background],
  };

  return (
    <section
      id={id}
      className={["site-section", className].filter(Boolean).join(" ")}
      style={style}
    >
      <Container className={containerClassName} maxWidth={containerMaxWidth}>
        {children}
      </Container>
    </section>
  );
}
