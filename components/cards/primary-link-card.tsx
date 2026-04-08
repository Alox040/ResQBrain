type PrimaryLinkCardProps = {
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  external?: boolean;
  date?: string;
};

export function PrimaryLinkCard({
  title,
  description,
  href,
  actionLabel,
  external,
  date,
}: PrimaryLinkCardProps) {
  const linkClassName =
    "inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)] transition-colors hover:text-[#33d6df]";

  return (
    <article className="flex h-full flex-col rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--card-padding)]">
      <div className="flex flex-1 flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--color-text-primary)]">
          {title}
        </h2>
        <p className="text-sm leading-7 text-[var(--color-text-secondary)]">{description}</p>
        {date ? (
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            Stand: {date}
          </p>
        ) : null}
      </div>

      <div className="mt-6 border-t border-[var(--color-border)] pt-6">
        {external ? (
          <a
            href={href}
            className={linkClassName}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{actionLabel}</span>
            <span aria-hidden="true">→</span>
          </a>
        ) : (
          <a href={href} className={linkClassName}>
            <span>{actionLabel}</span>
            <span aria-hidden="true">→</span>
          </a>
        )}
      </div>
    </article>
  );
}
