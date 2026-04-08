import React from "react";

type CardProps = {
  title?: string;
  children?: React.ReactNode;
};

export function Card({ title = "Card", children }: CardProps) {
  return (
    <section>
      <h2>{title}</h2>
      <div>{children ?? <p>Card content placeholder.</p>}</div>
    </section>
  );
}

