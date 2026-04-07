import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";
import { mitwirkungPageContent } from "@/lib/site/mitwirkung";

export default function MitwirkungPage() {
  return (
    <>
      <SectionFrame>
        <Container>
          <Stack gap="md">
            <p className="eyebrow">{mitwirkungPageContent.hero.subtitle}</p>
            <h1 className="hero-title">{mitwirkungPageContent.hero.title}</h1>
          </Stack>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <ContentCard>
            <p className="body-text muted-text">{mitwirkungPageContent.hero.text}</p>
          </ContentCard>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <ContentCard>
            <Stack gap="sm">
              <SectionHeading title={mitwirkungPageContent.why.title} />
              <p className="body-text muted-text">{mitwirkungPageContent.why.text}</p>
            </Stack>
          </ContentCard>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <ContentCard>
            <Stack gap="sm">
              <SectionHeading title={mitwirkungPageContent.survey.title} />
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
                <span className="badge">{mitwirkungPageContent.survey.badge}</span>
                <span className="eyebrow muted-text">{mitwirkungPageContent.survey.description}</span>
                <span className="eyebrow muted-text">Stand: {mitwirkungPageContent.survey.date}</span>
              </div>
              <p className="body-text muted-text">{mitwirkungPageContent.survey.text}</p>
              <div>
                <ButtonLink href={mitwirkungPageContent.survey.href} size="lg">
                  {mitwirkungPageContent.survey.cta}
                </ButtonLink>
              </div>
            </Stack>
          </ContentCard>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <ContentCard>
            <Stack gap="sm">
              <SectionHeading title={mitwirkungPageContent.additional.title} />
              <ul className="stack stack--sm">
                {mitwirkungPageContent.additional.items.map((item) => (
                  <li key={item} className="body-text muted-text">
                    {item}
                  </li>
                ))}
              </ul>
            </Stack>
          </ContentCard>
        </Container>
      </SectionFrame>

      {mitwirkungPageContent.previousSurveys.items.length > 0 && (
        <SectionFrame compact>
          <Container>
            <ContentCard>
              <Stack gap="sm">
                <SectionHeading title={mitwirkungPageContent.previousSurveys.title} />
                <ul className="stack stack--sm">
                  {mitwirkungPageContent.previousSurveys.items.map((item) => (
                    <li key={item.href} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", flexWrap: "wrap" }}>
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="body-text muted-text">
                        {item.label}
                      </a>
                      <span className="eyebrow muted-text">{item.description}</span>
                      <span className="eyebrow muted-text">Stand: {item.date}</span>
                    </li>
                  ))}
                </ul>
              </Stack>
            </ContentCard>
          </Container>
        </SectionFrame>
      )}

      <SectionFrame compact>
        <Container>
          <ContentCard>
            <p className="body-text muted-text">{mitwirkungPageContent.note.text}</p>
          </ContentCard>
        </Container>
      </SectionFrame>
    </>
  );
}
