type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
        {eyebrow}
      </p>
      <h2 className="text-4xl font-bold tracking-[-0.03em] text-[var(--color-text-primary)] md:text-5xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-3xl text-base leading-7 text-[var(--color-text-secondary)] md:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
