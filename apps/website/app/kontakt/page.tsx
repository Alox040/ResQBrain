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
          <div className="layout-split">
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
          <div className="layout-split layout-split--compact">
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
                „Projekt mitmachen“. Für einzelne Fragen ist der E-Mail-Kontakt weiterhin möglich.
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
