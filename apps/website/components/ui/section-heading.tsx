type SectionHeadingProps = {
  title: string;
  eyebrow?: string;
  className?: string;
};

export function SectionHeading({ title, eyebrow, className }: SectionHeadingProps) {
  return (
    <div className={["stack stack--sm", className].filter(Boolean).join(" ")}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="section-title">{title}</h2>
    </div>
  );
}
