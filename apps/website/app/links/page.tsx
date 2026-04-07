import type { Metadata, Viewport } from "next";

import styles from "./links-bio.module.css";
import { ButtonLink } from "@/components/ui/button-link";
import { surveys } from "@/lib/site/survey";

export const metadata: Metadata = {
  title: "ResQBrain — Links",
  description:
    "ResQBrain: Projekt für den Rettungsdienst — Umfrage, Discord und Projektübersicht.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

type LinkItem = {
  label: string;
  href: string;
  badge?: string;
  description?: string;
  date?: string;
};

const LINKS: LinkItem[] = [
  {
    label: "2 Minuten Feedback",
    href: surveys.active.href,
    badge: surveys.active.label,
    description: surveys.active.description,
    date: surveys.active.date,
  },
  {
    label: "Discord Community",
    href: "https://discord.gg/NszaAYAucf",
  },
  {
    label: "Projektübersicht",
    href: "https://github.com/Alox040/ResQBrain#",
  },
];

export default function LinksPage() {
  return (
    <main className={styles.main}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h1 className={styles.title}>ResQBrain</h1>
          <p className={styles.tagline}>Rettungsdienst · Feedback</p>
        </header>

        <ul className={styles.stack}>
          {LINKS.flatMap((item) => {
            const row = (
              <li key={item.href} className={styles.stackItem}>
                <a
                  className={styles.cta}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                </a>
                {(item.badge || item.description || item.date) && (
                  <div className={styles.linkMeta}>
                    {item.badge && <span className="badge">{item.badge}</span>}
                    {item.description && <span className="eyebrow muted-text">{item.description}</span>}
                    {item.date && <span className="eyebrow muted-text">Stand: {item.date}</span>}
                  </div>
                )}
              </li>
            );

            if (item.label === "Discord Community") {
              return [
                row,
                <li key="nachricht-schreiben" className={styles.stackItem}>
                  <div className="flex justify-center">
                    <ButtonLink
                      href="mailto:triggerhub@outlook.com?subject=ResQBrain%20Feedback"
                    >
                      Nachricht schreiben
                    </ButtonLink>
                  </div>
                </li>,
              ];
            }

            if (item.label === "Projektübersicht") {
              return [
                row,
                <li key="zur-startseite" className={styles.stackItem}>
                  <a className={styles.cta} href="/">
                    Zur Startseite
                  </a>
                </li>,
              ];
            }

            return [row];
          })}
        </ul>

        {surveys.previous.length > 0 && (
          <section className={styles.previousSection}>
            <p className={styles.sectionLabel}>Vorherige Umfragen</p>
            <ul className={styles.stack}>
              {surveys.previous.map((item) => (
                <li key={item.href} className={styles.stackItem}>
                  <a
                    className={styles.ctaSecondary}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                  <div className={styles.linkMeta}>
                    <span className="eyebrow muted-text">{item.description}</span>
                    <span className="eyebrow muted-text">Stand: {item.date}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
