import Link from "next/link";

type SocialCardProps = {
  platform: string;
  description?: string;
  href: string;
  external?: boolean;
};

export function SocialCard({
  platform,
  description,
  href,
  external,
}: SocialCardProps) {
  const linkClassName =
    "inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)] transition-colors hover:text-[#33d6df]";

  return (
    <article className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--card-padding)]">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold tracking-[-0.02em] text-[var(--color-text-primary)]">
            {platform}
          </h3>
          {description ? (
            <p className="text-sm leading-7 text-[var(--color-text-secondary)]">
              {description}
            </p>
          ) : null}
        </div>

        {external ? (
          <a
            href={href}
            className={linkClassName}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{platform}</span>
            <span aria-hidden="true">→</span>
          </a>
        ) : (
          <Link href={href} className={linkClassName}>
            <span>{platform}</span>
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </article>
  );
}
