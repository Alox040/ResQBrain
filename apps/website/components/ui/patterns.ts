/**
 * Gemeinsame Tailwind-Pattern für website-ui8 — ein Stilstandard ohne zusätzliche Logik.
 */

/** Vertikales Padding für Hero und SectionFrame (Startseite + SimpleDocument angeglichen). */
export const sectionPaddingY = "py-12 sm:py-[4.25rem] lg:py-[4.75rem]";

/** Abstand Unterkante fixed Header zu Ankerzielen (~h-14 + Puffer). */
export const scrollMarginUnderHeader = "scroll-mt-24 md:scroll-mt-[5.5rem]";

/** Eyebrow / Kicker */
export const eyebrowClass =
  "text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--ems-accent)]";

/** Accent-Badge: weicher Hintergrund, Akzentfarbe für Text */
export const badgeAccentClass = "bg-[var(--accent-soft)] text-[var(--accent)]";

/** Wichtiger Hinweis / Callout mit Akzent-Leiste */
export const importantHintClass =
  "border-l-4 border-solid border-[var(--accent)] pl-3 text-sm leading-relaxed text-[var(--color-muted)]";

/** Primäre Sektionsüberschrift (H2) */
export const sectionTitleClass =
  "section-title-accent mt-1 mb-2 max-w-[40rem] text-[1.375rem] font-semibold leading-snug tracking-tight text-[var(--color-foreground)] sm:text-[1.625rem] sm:leading-tight";

/** Leade / Beschreibung unter Titel */
export const sectionLeadClass =
  "prose-rhythm mt-4 max-w-[42rem] text-[0.9375rem] leading-relaxed text-[var(--color-muted)] sm:mt-5 sm:text-base";

export const sectionChildrenClass = "mt-8 sm:mt-10";

/** Flächen-Karte (Features, Zielgruppen, Pilot) — Hover-Schatten via `.content-card-lift` */
export const cardClass =
  "flex h-full flex-col rounded-[12px] border border-solid border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6";

/** Sanftes Panel (z. B. Listenblock Problem/Nutzen); `--panel-bg` in globals.css */
export const panelClass =
  "rounded-[var(--radius-card)] border border-[var(--color-border)]/90 bg-[var(--panel-bg)] p-5 sm:p-7";

export const cardTitleClass =
  "text-[0.9375rem] font-semibold leading-snug tracking-tight text-[var(--color-foreground)] sm:text-base";

export const cardBodyClass = "mt-2.5 flex-1 text-sm leading-relaxed text-[var(--color-muted)]";

/** Primär-Button (CTA) */
export const buttonPrimaryClass =
  "btn-primary-lift inline-flex min-h-11 w-full min-w-0 items-center justify-center rounded-[var(--radius-control)] bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-hover)] sm:w-auto";

/** Sekundär-Button */
export const buttonSecondaryClass =
  "inline-flex min-h-11 w-full min-w-0 items-center justify-center rounded-[var(--radius-control)] border border-solid border-[var(--border)] bg-white px-5 py-2.5 text-sm font-medium text-[var(--text)] sm:w-auto";

/** Sekundär-Button Outline (Primärfarbe Rahmen/Text, z. B. Hero neben Vollflächen-Primary) */
export const buttonSecondaryOutlineClass =
  "inline-flex min-h-11 w-full min-w-0 items-center justify-center rounded-[var(--radius-control)] border border-solid border-[var(--primary)] bg-transparent px-5 py-2.5 text-sm font-medium text-[var(--primary)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--primary)_10%,transparent)] sm:w-auto";

/** Text-Link (kartensintern) */
export const linkTextClass =
  "mt-auto pt-4 text-sm font-medium text-[var(--color-primary)] underline-offset-[3px] transition-colors hover:text-[var(--color-primary-hover)] hover:underline";

export const faqDisclosurePadding = "px-4 py-4 sm:px-6 sm:py-5";
