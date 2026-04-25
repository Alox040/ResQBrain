import { Container } from "@/components/layout/container";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { mitwirkungPageContent } from "@/lib/site/mitwirkung";

export function SurveySection() {
  const { survey, previousSurveys } = mitwirkungPageContent;

  return (
    <section
      id="survey"
      className="bg-[var(--color-bg)] py-[var(--section-padding)] text-[var(--color-text-primary)]"
    >
      <Container>
        <div className="space-y-10">
          <div className="grid gap-8 rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface-highlight)] p-8 md:p-12">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
                  {survey.badge}
                </span>
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {survey.description}
                </span>
                <span className="text-sm text-[var(--color-text-secondary)]">
                  Stand: {survey.date}
                </span>
              </div>

              <h2 className="text-4xl font-bold tracking-[-0.03em] text-[var(--color-text-primary)] md:text-5xl">
                {survey.title}
              </h2>

              <p className="max-w-2xl text-base leading-7 text-[var(--color-text-secondary)] md:text-lg">
                {survey.text}
              </p>

              <ButtonPrimary href={survey.href} external>
                {survey.cta}
              </ButtonPrimary>
            </div>
          </div>

          {previousSurveys.items.length > 0 ? (
            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--card-padding)]">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                {previousSurveys.title}
              </h3>
              <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-7 text-[var(--color-text-secondary)]">
                {previousSurveys.items.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="font-medium text-[var(--color-accent)] hover:text-[#33d6df]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                    <span className="text-[var(--color-text-secondary)]">
                      {" "}
                      · {item.description} · Stand: {item.date}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
