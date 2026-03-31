type ContentPlaceholderProps = {
  /** Kurzbeschreibung, was der Projektinhaber hier eintragen soll. */
  label: string;
};

/**
 * Sichtbar gekennzeichneter Platzhalter — keine erfundenen Inhalte.
 */
export function ContentPlaceholder({ label }: ContentPlaceholderProps) {
  return (
    <span
      className="inline-block max-w-full rounded border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-sm text-[var(--color-muted)]"
      data-placeholder="true"
    >
      [Platzhalter: {label}]
    </span>
  );
}
