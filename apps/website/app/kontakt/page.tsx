import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";
import { contactInfo, contactPageContent } from "@/lib/site/contact-page";

export default function KontaktPage() {
  return (
    <>
      <SectionFrame>
        <Container>
          <Stack gap="md">
            <p className="eyebrow">{contactPageContent.hero.subtitle}</p>
            <h1 className="hero-title">{contactPageContent.hero.title}</h1>
          </Stack>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <ContentCard>
            <p className="body-text muted-text">{contactPageContent.description}</p>
          </ContentCard>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <ContentCard>
            <Stack gap="sm">
              <SectionHeading title={contactPageContent.contact.title} />
              <p className="body-text muted-text">{contactPageContent.contact.text}</p>
              <div>
                <ButtonLink href={contactInfo.email.href}>{contactInfo.email.label}</ButtonLink>
              </div>
            </Stack>
          </ContentCard>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <ContentCard>
            <p className="body-text muted-text">{contactPageContent.note}</p>
          </ContentCard>
        </Container>
      </SectionFrame>
    </>
  );
}
