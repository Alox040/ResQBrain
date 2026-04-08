import React from "react";

type SectionProps = {
  heading?: string;
  children?: React.ReactNode;
};

export function Section({ heading = "Section", children }: SectionProps) {
  return (
    <section>
      <h2>{heading}</h2>
      <div>{children ?? <p>Section content placeholder.</p>}</div>
    </section>
  );
}

