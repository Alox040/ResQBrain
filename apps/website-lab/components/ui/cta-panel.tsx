import type { ReactNode } from "react";

type CtaPanelProps = {
  eyebrow: string;
  title: string;
  text: string;
  actions: ReactNode;
  aside?: ReactNode;
};

export function CtaPanel({ eyebrow, title, text, actions, aside }: CtaPanelProps) {
  return (
    <section className="cta-panel">
      <div className="cta-panel__body">
        <p className="cta-panel__eyebrow">{eyebrow}</p>
        <h2 className="cta-panel__title">{title}</h2>
        <p className="cta-panel__text">{text}</p>
        <div className="cta-panel__actions">{actions}</div>
      </div>
      {aside ? <div className="cta-panel__aside">{aside}</div> : null}
    </section>
  );
}
