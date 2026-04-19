import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";
import { TextLink } from "@/components/ui/text-link";

type AudienceItem = {
  audience: string;
  headline: string;
  paragraphs: readonly string[];
  status: {
    label: string;
  };
  cta?: {
    label: string;
    href: string;
  };
};

export type AudienceSectionProps = {
  title: string;
  items: readonly AudienceItem[];
  closingText: string;
  cta: {
    label: string;
    href: string;
  };
};

export function AudienceSection({ title, items, closingText, cta }: AudienceSectionProps) {
  return (
    <SectionFrame compact>
      <Container>
        <Stack gap="md">
          <SectionHeading title={title} />
          <div className="use-case-list">
            {items.map((item) => (
              <ContentCard key={item.headline}>
                <Stack gap="sm">
                  <span className="badge">{item.status.label}</span>
                  <p className="eyebrow muted-text">{item.audience}</p>
                  <h2 className="card-heading">{item.headline}</h2>
                  {item.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="body-text muted-text">
                      {paragraph}
                    </p>
                  ))}
                  {item.cta ? <TextLink href={item.cta.href}>{item.cta.label}</TextLink> : null}
                </Stack>
              </ContentCard>
            ))}
          </div>
          <div className="card card--subtle use-case-cta">
            <p className="body-text muted-text section-intro">{closingText}</p>
            <TextLink href={cta.href}>{cta.label}</TextLink>
          </div>
        </Stack>
      </Container>
    </SectionFrame>
  );
}
