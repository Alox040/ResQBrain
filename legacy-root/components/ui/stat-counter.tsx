type StatCounterProps = {
  value: string | number;
  label?: string;
};

export function StatCounter({ value, label }: StatCounterProps) {
  return (
    <div className="inline-flex min-w-[140px] flex-col rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-5">
      <span className="text-4xl font-bold tracking-[-0.04em] text-[var(--color-text-primary)]">
        {value}
      </span>
      {label ? (
        <span className="mt-2 text-sm text-[var(--color-text-secondary)]">
          {label}
        </span>
      ) : null}
    </div>
  );
}
