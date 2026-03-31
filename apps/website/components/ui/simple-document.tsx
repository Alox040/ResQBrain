import type { PropsWithChildren } from "react";

import { Container } from "@/components/ui/container";
import { SectionFrame } from "@/components/ui/section-frame";

type SimpleDocumentProps = PropsWithChildren<{
  title: string;
}>;

export function SimpleDocument({ children, title }: SimpleDocumentProps) {
  return (
    <SectionFrame>
      <Container maxWidth="narrow">
        <article className="stack stack--lg">
          <h1 className="page-title">{title}</h1>
          <div className="stack stack--md body-text">{children}</div>
        </article>
      </Container>
    </SectionFrame>
  );
}
