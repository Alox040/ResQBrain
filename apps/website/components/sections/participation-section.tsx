import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionFrame } from "@/components/ui/section-frame";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stack } from "@/components/ui/stack";
import { homeContent } from "@/lib/site";
import { survey } from "@/lib/site/survey";

export function ParticipationSection() {
  return (
    <SectionFrame id="participation">
      <Container>
        <div className="home-panel">
          <Stack gap="md">
            <SectionHeading title={homeContent.mitwirkung.title} />
            <p className="body-text muted-text">{homeContent.mitwirkung.text}</p>
            <div>
              <ButtonLink href={survey.href} external>
                {homeContent.mitwirkung.cta.label}
              </ButtonLink>
            </div>
          </Stack>
        </div>
      </Container>
    </SectionFrame>
  );
}
