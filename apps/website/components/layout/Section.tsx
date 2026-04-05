import type { CSSProperties, PropsWithChildren } from "react";

import { Container, type ContainerWidth } from "@/components/layout/Container";

type SectionBackground = "none" | "surface" | "subtle";

type SectionProps = PropsWithChildren<{
  id?: string;
  className?: string;
  background?: SectionBackground;
  containerClassName?: string;
  containerWidth?: ContainerWidth;
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
  containerWidth = "content",
}: SectionProps) {
  const style: CSSProperties = {
    backgroundColor: backgroundMap[background],
  };

  return (
    <section
      id={id}
      className={["section-frame", className].filter(Boolean).join(" ")}
      style={style}
    >
      <Container className={containerClassName} maxWidth={containerWidth}>
        {children}
      </Container>
    </section>
  );
}
