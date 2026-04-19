import type { ReactNode } from "react";

import { PageContainer } from "@/components/layout/page-container";

export interface SectionContainerProps {
  children: ReactNode;
  hasBorder?: boolean;
  className?: string;
}

function joinClasses(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function SectionContainer({
  children,
  hasBorder = true,
  className,
}: SectionContainerProps) {
  return (
    <section
      className={joinClasses(
        "py-24 sm:py-32",
        hasBorder && "border-b border-zinc-900/50",
        className,
      )}
    >
      <PageContainer maxWidth="md">{children}</PageContainer>
    </section>
  );
}
