import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";
import { linksPageContent } from "@/lib/site/links-page";

export default function LinksPage() {
  return (
    <>
      <SectionFrame>
        <Container>
          <Stack gap="md">
            <p className="eyebrow">{linksPageContent.hero.subtitle}</p>
            <h1 className="hero-title">{linksPageContent.hero.title}</h1>
            <p className="body-text muted-text section-lead">{linksPageContent.description}</p>
          </Stack>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <div
            style={{
              display: "grid",
              gap: "var(--space-5)",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
            }}
          >
            {linksPageContent.links.map((item) => (
              <ContentCard key={item.title}>
                <Stack gap="sm">
                  <SectionHeading title={item.title} />
                  <p className="body-text muted-text">{item.text}</p>
                  {item.date ? <p className="eyebrow muted-text">Stand: {item.date}</p> : null}
                  <div className="cta-actions">
                    <ButtonLink href={item.href} external={item.external}>
                      {item.label}
                    </ButtonLink>
                  </div>
                </Stack>
              </ContentCard>
            ))}
          </div>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <ContentCard>
            <div
              style={{
                display: "grid",
                gap: "var(--space-5)",
                alignItems: "end",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              }}
            >
              <Stack gap="sm">
                <SectionHeading title={linksPageContent.cta.title} />
                <p className="body-text muted-text section-intro">{linksPageContent.cta.text}</p>
              </Stack>
              <div className="cta-actions" style={{ alignSelf: "end" }}>
                <ButtonLink href={linksPageContent.cta.href}>{linksPageContent.cta.label}</ButtonLink>
              </div>
            </div>
          </ContentCard>
        </Container>
      </SectionFrame>
    </>
  );
}
