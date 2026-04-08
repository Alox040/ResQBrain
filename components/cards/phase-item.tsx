type PhaseItemProps = {
  label: string;
  title: string;
  description: string;
};

export function PhaseItem({ label, title, description }: PhaseItemProps) {
  return (
    <article className="grid grid-cols-1 gap-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--card-padding)] md:grid-cols-[88px_1fr]">
      <div className="flex items-start md:justify-center">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)] md:[writing-mode:vertical-rl] md:rotate-180">
          {label}
        </span>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--color-text-primary)]">
          {title}
        </h3>
        <p className="text-sm leading-7 text-[var(--color-text-secondary)]">
          {description}
        </p>
      </div>
    </article>
  );
}
