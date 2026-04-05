import { Section } from "@/components/layout/Section";
import { Stack } from "@/components/layout/Stack";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqSectionProps = {
  title: string;
  items: readonly FaqItem[];
};

export function FaqSection({ title, items }: FaqSectionProps) {
  const limitedItems = items.slice(0, 4);

  return (
    <Section>
      <Stack gap="var(--space-7)">
        <div className="section-lead">
          <h2 className="section-title">{title}</h2>
        </div>

        <div className="faq-accordion">
          {limitedItems.map((item) => (
            <details className="card card--accordion faq-item" key={item.question}>
              <summary className="faq-question">
                <span className="faq-question-text">{item.question}</span>
              </summary>
              <p className="small-text muted-text faq-answer">{item.answer}</p>
            </details>
          ))}
        </div>
      </Stack>
    </Section>
  );
}
