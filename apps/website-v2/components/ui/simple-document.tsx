import type { PropsWithChildren } from "react";

type SimpleDocumentProps = PropsWithChildren<{
  title: string;
}>;

export function SimpleDocument({ children, title }: SimpleDocumentProps) {
  return (
    <article>
      <h1>{title}</h1>
      <div>{children}</div>
    </article>
  );
}
