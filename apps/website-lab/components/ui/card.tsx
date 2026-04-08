import type { ReactNode } from "react";

type CardProps = {
  title: string;
  text: string;
  eyebrow?: string;
  list?: readonly string[];
  meta?: readonly string[];
  actions?: ReactNode;
  span?: 4 | 5 | 6 | 7 | 8;
  tone?: "default" | "accent" | "soft";
};

export function Card({
  title,
  text,
  eyebrow,
  list,
  meta,
  actions,
  span = 4,
  tone = "default",
}: CardProps) {
  return (
    <article className={`card card--span-${span} card--${tone}`}>
      {eyebrow ? <p className="card__eyebrow">{eyebrow}</p> : null}
      <div className="card__body">
        <h3 className="card__title">{title}</h3>
        <p className="card__text">{text}</p>
      </div>
      {list ? (
        <ul className="card__list">
          {list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {meta ? (
        <div className="card__meta">
          {meta.map((item) => (
            <span className="card__pill" key={item}>
              {item}
            </span>
          ))}
        </div>
      ) : null}
      {actions ? <div className="card__actions">{actions}</div> : null}
    </article>
  );
}
