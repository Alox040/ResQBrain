import { Container } from "@/components/ui/container";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";
import { TextLink } from "@/components/ui/text-link";

type FaqItem = {
  question: string;
  answer: string;
  cta?: {
    label: string;
    href: string;
  };
};

export type FaqSectionProps = {
  title: string;
  items: readonly FaqItem[];
};

export function FaqSection({ title, items }: FaqSectionProps) {
  return (
    <SectionFrame compact>
      <Container>
        <Stack gap="md">
          <SectionHeading title={title} />
          <div className="faq-accordion">
            {items.map((item) => (
              <details key={item.question} className="card card--accordion faq-item">
                <summary className="faq-question">
                  <span className="faq-question-text">{item.question}</span>
                </summary>
                <div className="faq-answer">
                  <p className="small-text muted-text">{item.answer}</p>
                  {item.cta ? (
                    <TextLink href={item.cta.href}>{item.cta.label}</TextLink>
                  ) : null}
                </div>
              </details>
            ))}
          </div>
        </Stack>
      </Container>
    </SectionFrame>
  );
}
