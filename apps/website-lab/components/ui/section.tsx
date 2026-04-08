import type { PropsWithChildren } from "react";

type SectionProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  text?: string;
}>;

export function Section({ eyebrow, title, text, children }: SectionProps) {
  return (
    <section className="section">
      <div className="section__header">
        <p className="section__eyebrow">{eyebrow}</p>
        <h2 className="section__title">{title}</h2>
        {text ? <p className="section__text">{text}</p> : null}
      </div>
      {children}
    </section>
  );
}
