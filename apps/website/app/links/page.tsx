import type { Metadata, Viewport } from "next";

import styles from "./links-bio.module.css";

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

const LINKS = [
  {
    label: "Aktuelle Umfrage",
    href: "https://forms.cloud.microsoft/r/ZFVgC0L1BZ",
  },
  {
    label: "Discord Community",
    href: "https://discord.gg/NszaAYAucf",
  },
  {
    label: "Projektübersicht",
    href: "https://github.com/Alox040/ResQBrain#",
  },
] as const;

export default function LinksPage() {
  return (
    <main className={styles.main}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h1 className={styles.title}>ResQBrain</h1>
          <p className={styles.tagline}>Rettungsdienst · Feedback</p>
        </header>

        <ul className={styles.stack}>
          {LINKS.map((item) => (
            <li key={item.href} className={styles.stackItem}>
              <a
                className={styles.cta}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
