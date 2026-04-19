import type { PropsWithChildren } from "react";

type SectionFrameProps = PropsWithChildren<{
  id?: string;
  compact?: boolean;
  density?: "hero" | "default" | "compact";
}>;

export function SectionFrame({
  children,
  id,
  compact = false,
  density,
}: SectionFrameProps) {
  const resolvedDensity = density ?? (compact ? "compact" : "default");
  const sectionClassName = [
    "section-frame",
    resolvedDensity === "compact" ? "section-frame--compact" : "",
    resolvedDensity === "hero" ? "section-frame--hero" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section id={id} className={sectionClassName}>
      {children}
    </section>
  );
}
