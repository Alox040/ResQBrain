import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";
import { homeContent } from "@/lib/site";
import { contact } from "@/lib/site/contact";

export function ContactCtaSection() {
  return (
    <SectionFrame id="contact" compact>
      <Container>
        <div className="home-panel">
          <Stack gap="md">
            <SectionHeading title={homeContent.kontaktCta.title} eyebrow="Austausch" />
            <p className="body-text muted-text">{homeContent.kontaktCta.text}</p>
            <div className="home-actions">
              <ButtonLink href={`mailto:${contact.email}`} external>
                {homeContent.kontaktCta.cta.label}
              </ButtonLink>
            </div>
          </Stack>
        </div>
      </Container>
    </SectionFrame>
  );
}
