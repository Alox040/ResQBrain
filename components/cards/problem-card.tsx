type ProblemCardProps = {
  title: string;
  description: string;
};

export function ProblemCard({ title, description }: ProblemCardProps) {
  return (
    <article className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--card-padding)]">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold tracking-[-0.02em] text-[var(--color-text-primary)]">
          {title}
        </h3>
        <p className="text-sm leading-7 text-[var(--color-text-secondary)]">
          {description}
        </p>
      </div>
    </article>
  );
}
