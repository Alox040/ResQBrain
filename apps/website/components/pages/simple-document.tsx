import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { scrollMarginUnderHeader, sectionPaddingY } from "@/components/ui/patterns";

export type SimpleDocumentProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function SimpleDocument({ title, description, children }: SimpleDocumentProps) {
  return (
    <div
      className={`${scrollMarginUnderHeader} border-b border-[var(--color-border)]/80 bg-[var(--color-band)] ${sectionPaddingY}`}
    >
      <Container className="max-w-[42rem]">
        <h1 className="max-w-[40rem] text-[1.625rem] font-semibold leading-snug tracking-tight text-[var(--color-foreground)] sm:text-[1.875rem] sm:leading-tight">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-[42rem] text-[0.9375rem] leading-relaxed text-[var(--color-muted)] sm:text-base">
            {description}
          </p>
        ) : null}
        <div className="prose-rhythm mt-8 max-w-[42rem] text-[0.9375rem] leading-relaxed text-[var(--color-muted)] sm:mt-10 sm:text-base">
          {children}
        </div>
      </Container>
    </div>
  );
}
