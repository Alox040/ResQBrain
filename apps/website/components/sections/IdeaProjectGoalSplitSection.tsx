import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";

type TextCard = {
  headline: string;
  text: string;
  status?: {
    label: string;
  };
};

type IdeaProjectGoalSplitSectionProps = {
  primary: {
    title: string;
    subtitle?: string;
    cards: readonly TextCard[];
    disclaimer?: string;
  };
  secondary: {
    title: string;
    subtitle?: string;
    cards: readonly TextCard[];
    disclaimer?: string;
  };
};

export function IdeaProjectGoalSplitSection({ primary, secondary }: IdeaProjectGoalSplitSectionProps) {
  return (
    <SectionFrame compact>
      <Container>
        <div className="layout-split layout-split--compact">
          <ContentCard>
            <Stack gap="md">
              <Stack gap="sm">
                <SectionHeading title={primary.title} />
                {primary.subtitle ? <p className="body-text muted-text section-intro">{primary.subtitle}</p> : null}
              </Stack>
              <div className="feature-grid">
                {primary.cards.map((card) => (
                  <div key={card.headline} className="card card--nested">
                    <Stack gap="sm">
                      {card.status ? <span className="badge">{card.status.label}</span> : null}
                      <h2 className="card-heading">{card.headline}</h2>
                      <p className="body-text muted-text">{card.text}</p>
                    </Stack>
                  </div>
                ))}
              </div>
              {primary.disclaimer ? <p className="body-text muted-text section-intro idea-disclaimer">{primary.disclaimer}</p> : null}
            </Stack>
          </ContentCard>

          <ContentCard>
            <Stack gap="md">
              <Stack gap="sm">
                <SectionHeading title={secondary.title} />
                {secondary.subtitle ? <p className="body-text muted-text section-intro">{secondary.subtitle}</p> : null}
              </Stack>
              <dl className="trust-list">
                {secondary.cards.map((card) => (
                  <div key={card.headline} className="trust-list-item">
                    <dt className="card-heading">{card.headline}</dt>
                    <dd className="body-text muted-text">{card.text}</dd>
                  </div>
                ))}
              </dl>
              {secondary.disclaimer ? <p className="body-text muted-text section-intro">{secondary.disclaimer}</p> : null}
            </Stack>
          </ContentCard>
        </div>
      </Container>
    </SectionFrame>
  );
}
