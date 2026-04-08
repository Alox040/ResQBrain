import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";
import { contactInfo, contactPageContent } from "@/lib/site/contact-page";
import { routes } from "@/lib/routes";

export default function KontaktPage() {
  return (
    <>
      <SectionFrame>
        <Container>
          <div
            style={{
              display: "grid",
              gap: "var(--space-6)",
              alignItems: "start",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            }}
          >
            <Stack gap="md">
              <p className="eyebrow">{contactPageContent.hero.subtitle}</p>
              <h1 className="hero-title">{contactPageContent.hero.title}</h1>
              <p className="body-text muted-text section-lead">{contactPageContent.description}</p>
            </Stack>

            <ContentCard>
              <Stack gap="sm">
                <SectionHeading title={contactPageContent.contact.title} />
                <p className="body-text muted-text">{contactPageContent.contact.text}</p>
                <a className="button-link button-link--lg" href={contactInfo.email.href}>
                  {contactPageContent.contact.cta}
                </a>
              </Stack>
            </ContentCard>
          </div>
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
                <p className="body-text muted-text">{contactInfo.email.label}</p>
              </Stack>
            </ContentCard>

            <ContentCard>
              <p className="body-text muted-text">{contactPageContent.note}</p>
            </ContentCard>
          </div>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <ContentCard>
            <Stack gap="sm">
              <SectionHeading title="Mitwirkung und Pilot" />
              <p className="body-text muted-text section-intro">
                Für strukturierte Rückmeldung zu Beta, Pilot oder Zusammenarbeit nutze das Formular
                „Projekt mitmachen“. Für einzelne Fragen bleibt der E-Mail-Weg bestehen.
              </p>
              <ButtonLink href={routes.mitwirken} size="lg">
                Zum Formular „Projekt mitmachen“
              </ButtonLink>
            </Stack>
          </ContentCard>
        </Container>
      </SectionFrame>
    </>
  );
}
