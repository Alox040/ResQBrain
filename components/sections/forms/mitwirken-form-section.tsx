import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { mitwirkenContent } from "@/lib/site/mitwirken-content";

export function MitwirkenFormSection() {
  const { form } = mitwirkenContent;
  const { fields, interestCheckboxes } = form;

  return (
    <section
      id="mitwirken-form"
      className="bg-[var(--color-bg)] py-[var(--section-padding)] text-[var(--color-text-primary)]"
    >
      <Container>
        <div className="mx-auto max-w-3xl space-y-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-[-0.03em] text-[var(--color-text-primary)] md:text-3xl">
              {form.title}
            </h2>
          </div>

          <div className="rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 md:p-10">
            <form className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="flex flex-col gap-3">
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">
                    {fields.name.label}
                  </span>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-accent)]"
                    placeholder={fields.name.placeholder}
                  />
                </label>

                <label className="flex flex-col gap-3">
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">
                    {fields.email.label}
                  </span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-accent)]"
                    placeholder={fields.email.placeholder}
                  />
                </label>
              </div>

              <label className="flex flex-col gap-3">
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  {fields.role.label}
                </span>
                <select
                  name="role"
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-accent)]"
                  defaultValue=""
                >
                  <option value="" disabled>
                    {fields.role.placeholder}
                  </option>
                  {fields.role.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>

              <fieldset className="space-y-4">
                <legend className="text-sm font-medium text-[var(--color-text-primary)]">
                  {fields.interestsLegend}
                </legend>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {interestCheckboxes.map((item) => (
                    <label
                      key={item.value}
                      className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3"
                    >
                      <input
                        type="checkbox"
                        name="interests"
                        value={item.value}
                        className="h-4 w-4 accent-[var(--color-accent)]"
                      />
                      <span className="text-sm text-[var(--color-text-secondary)]">
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="space-y-4">
                <ButtonPrimary type="submit">{form.submit}</ButtonPrimary>
                <p className="text-xs leading-6 text-[var(--color-text-secondary)]">
                  {form.privacyNote}{" "}
                  <Link
                    href={form.privacyHref}
                    className="font-medium text-[var(--color-accent)] underline-offset-2 hover:underline"
                  >
                    Datenschutz
                  </Link>
                  .
                </p>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
