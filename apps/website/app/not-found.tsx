import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { SectionFrame } from "@/components/ui/section-frame";
import { Stack } from "@/components/ui/stack";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <SectionFrame>
      <Container>
        <Stack gap="md">
          <h1 className="hero-title">Seite nicht gefunden</h1>
          <p className="body-text muted-text section-lead">Diese Seite existiert nicht.</p>
          <div className="cta-actions">
            <ButtonLink href={routes.home} size="lg">
              Zur Startseite
            </ButtonLink>
          </div>
        </Stack>
      </Container>
    </SectionFrame>
  );
}
