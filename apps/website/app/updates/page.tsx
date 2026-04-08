import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";
import { updatesPageContent } from "@/lib/site/updates-page";

export default function UpdatesPage() {
  return (
    <>
      <SectionFrame>
        <Container>
          <Stack gap="md">
            <p className="eyebrow">{updatesPageContent.hero.subtitle}</p>
            <h1 className="hero-title">{updatesPageContent.hero.title}</h1>
            <p className="body-text muted-text section-lead">{updatesPageContent.description}</p>
          </Stack>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <div
            style={{
              display: "grid",
              gap: "var(--space-5)",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            }}
          >
            <ContentCard>
              <Stack gap="sm">
                <SectionHeading title={updatesPageContent.cta.title} />
                <p className="body-text muted-text">{updatesPageContent.cta.text}</p>
                <div className="cta-actions">
                  <ButtonLink href={updatesPageContent.cta.href} size="lg" external>
                    {updatesPageContent.cta.label}
                  </ButtonLink>
                </div>
              </Stack>
            </ContentCard>

            <ContentCard>
              <Stack gap="sm">
                <SectionHeading title="Möglich für" />
                <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                  {updatesPageContent.info.map((item) => (
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

      <SectionFrame compact>
        <Container>
          <ContentCard>
            <p className="body-text muted-text section-intro">{updatesPageContent.note}</p>
          </ContentCard>
        </Container>
      </SectionFrame>
    </>
  );
}
