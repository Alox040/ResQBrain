import { ButtonLink } from "@/components/ui/button-link";
import { CardTitle } from "@/components/ui/card-title";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";
import { linksPageContent } from "@/lib/site";

export default function LinksPage() {
  return (
    <>
      <SectionFrame>
        <Container>
          <Stack gap="md">
            <p className="eyebrow">{linksPageContent.hero.subtitle}</p>
            <h1 className="hero-title">{linksPageContent.hero.title}</h1>
          </Stack>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <ContentCard>
            <p className="body-text muted-text">{linksPageContent.description}</p>
          </ContentCard>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <Stack gap="md">
            <SectionHeading title={linksPageContent.projectLinks.title} />
            <Stack gap="md">
              {linksPageContent.projectLinks.items.map((item) => (
                <ContentCard key={item.label}>
                  <Stack gap="sm">
                    <CardTitle>{item.label}</CardTitle>
                    <p className="body-text muted-text">{item.description}</p>
                    <div>
                      <ButtonLink href={item.href} variant="secondary" external={item.external}>
                        {item.label}
                      </ButtonLink>
                    </div>
                  </Stack>
                </ContentCard>
              ))}
            </Stack>
          </Stack>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <Stack gap="md">
            <SectionHeading title={linksPageContent.communityLinks.title} />
            <Stack gap="md">
              {linksPageContent.communityLinks.items.map((item) => (
                <ContentCard key={item.label}>
                  <Stack gap="sm">
                    <CardTitle>{item.label}</CardTitle>
                    <p className="body-text muted-text">{item.description}</p>
                    <div>
                      <ButtonLink href={item.href} variant="secondary" external={item.external}>
                        {item.label}
                      </ButtonLink>
                    </div>
                  </Stack>
                </ContentCard>
              ))}
            </Stack>
          </Stack>
        </Container>
      </SectionFrame>
    </>
  );
}
