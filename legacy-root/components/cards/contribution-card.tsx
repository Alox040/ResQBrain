import Link from "next/link";

type ContributionCardProps = {
  title: string;
  description: string;
  href: string;
  linkLabel?: string;
  external?: boolean;
};

export function ContributionCard({
  title,
  description,
  href,
  linkLabel,
  external,
}: ContributionCardProps) {
  const actionLabel = linkLabel ?? title;
  const isMailto = href.startsWith("mailto:");

  return (
    <article className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--card-padding)]">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold tracking-[-0.02em] text-[var(--color-text-primary)]">
            {title}
          </h3>
          <p className="text-sm leading-7 text-[var(--color-text-secondary)]">
            {description}
          </p>
        </div>

        {isMailto ? (
          <a
            href={href}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)] transition-colors hover:text-[#33d6df]"
          >
            <span>{actionLabel}</span>
            <span aria-hidden="true">→</span>
          </a>
        ) : null}

        {!isMailto && external ? (
          <a
            href={href}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)] transition-colors hover:text-[#33d6df]"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{actionLabel}</span>
            <span aria-hidden="true">→</span>
          </a>
        ) : null}

        {!isMailto && !external ? (
          <Link
            href={href}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)] transition-colors hover:text-[#33d6df]"
          >
            <span>{actionLabel}</span>
            <span aria-hidden="true">→</span>
          </Link>
        ) : null}
      </div>
    </article>
  );
}
