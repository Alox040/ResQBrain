import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";
import { mitwirkungPageContent } from "@/lib/site/mitwirkung";
import { routes } from "@/lib/routes";

export default function MitwirkungPage() {
  return (
    <>
      <SectionFrame>
        <Container>
          <div className="layout-split">
            <Stack gap="md">
              <p className="eyebrow">{mitwirkungPageContent.hero.subtitle}</p>
              <h1 className="hero-title">{mitwirkungPageContent.hero.title}</h1>
              <p className="body-text muted-text section-lead">{mitwirkungPageContent.hero.text}</p>
            </Stack>

            <ContentCard>
              <Stack gap="md">
                <SectionHeading title={mitwirkungPageContent.survey.title} />
                <div className="ui8-action-row">
                  <span className="badge">{mitwirkungPageContent.survey.badge}</span>
                  <span className="eyebrow muted-text">{mitwirkungPageContent.survey.description}</span>
                  <span className="eyebrow muted-text">Stand: {mitwirkungPageContent.survey.date}</span>
                </div>
                <ButtonLink href={mitwirkungPageContent.survey.href} size="lg" external>
                  {mitwirkungPageContent.survey.cta}
                </ButtonLink>
              </Stack>
            </ContentCard>
          </div>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <div className="layout-split layout-split--compact">
            <ContentCard>
              <Stack gap="sm">
                <SectionHeading title={mitwirkungPageContent.why.title} />
                <p className="body-text muted-text">{mitwirkungPageContent.why.text}</p>
              </Stack>
            </ContentCard>

            <ContentCard>
              <Stack gap="sm">
                <SectionHeading title={mitwirkungPageContent.additional.title} />
                <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                  {mitwirkungPageContent.additional.items.map((item) => (
                    <li key={item} className="body-text muted-text">
                      {item}
                    </li>
                  ))}
                </ul>
              </Stack>
            </ContentCard>
          </div>
        </Container>
      </SectionFrame>

      {mitwirkungPageContent.previousSurveys.items.length > 0 && (
        <SectionFrame compact>
          <Container>
            <ContentCard>
              <Stack gap="sm">
                <SectionHeading title={mitwirkungPageContent.previousSurveys.title} />
                <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                  {mitwirkungPageContent.previousSurveys.items.map((item) => (
                    <li key={item.href} className="body-text muted-text">
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", alignItems: "center" }}>
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="body-text">
                          {item.label}
                        </a>
                        <span className="eyebrow muted-text">{item.description}</span>
                        <span className="eyebrow muted-text">Stand: {item.date}</span>
                      </div>
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
            <p className="body-text muted-text section-intro">{mitwirkungPageContent.note.text}</p>
          </ContentCard>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <ContentCard>
            <Stack gap="sm">
              <SectionHeading title="Projekt mitmachen" />
              <p className="body-text muted-text section-intro">
                Interesse an Tests, Pilot oder Projekt-Updates kannst du über das kurze Formular
                melden — freiwillig und ohne Verpflichtung.
              </p>
              <ButtonLink href={routes.mitwirken} size="lg">
                Zum Formular
              </ButtonLink>
            </Stack>
          </ContentCard>
        </Container>
      </SectionFrame>
    </>
  );
}
