import Link from "next/link";

import styles from "./links-bio.module.css";
import { routes } from "@/lib/routes";
import { publicLinks } from "@/lib/site/public-links";
import { surveys } from "@/lib/site/survey";

type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

const primaryLinks: readonly LinkItem[] = [
  { label: "Mitwirken", href: routes.mitwirken },
  {
    label: surveys.active.label,
    href: surveys.active.href,
    external: true,
  },
  { label: "Community", href: publicLinks.github, external: true },
  { label: "Discord", href: publicLinks.discord, external: true },
] as const;

const secondaryLinks: readonly LinkItem[] = [
  { label: "Reddit", href: "https://www.reddit.com/search/?q=ResQBrain", external: true },
  { label: "TikTok", href: "https://www.tiktok.com/@resqbrain", external: true },
  { label: "Website", href: publicLinks.website, external: true },
] as const;

function LinkButton({ href, label, external = false, secondary = false }: LinkItem & { secondary?: boolean }) {
  const className = secondary ? styles.ctaSecondary : styles.cta;

  if (external) {
    return (
      <a className={className} href={href} rel="noreferrer" target="_blank">
        {label}
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {label}
    </Link>
  );
}

export default function LinksPage() {
  return (
    <main className={styles.main}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h1 className={styles.title}>ResQBrain Links</h1>
        </header>

        <div className={styles.stack}>
          {primaryLinks.map((item) => (
            <LinkButton key={item.href} {...item} />
          ))}
        </div>

        <section className={styles.previousSection}>
          <h2 className={styles.sectionLabel}>Mehr</h2>
          <div className={styles.secondaryStack}>
            {secondaryLinks.map((item) => (
              <LinkButton key={item.href} {...item} secondary />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
