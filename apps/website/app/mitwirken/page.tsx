import Link from "next/link";

import { MitwirkenForm } from "@/components/forms/mitwirken-form";
import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { SectionFrame } from "@/components/ui/section-frame";
import { Stack } from "@/components/ui/stack";
import { routes } from "@/lib/routes";

export default function MitwirkenPage() {
  return (
    <>
      <SectionFrame>
        <Container>
          <Stack gap="md">
            <Link className="site-nav-link" href={routes.mitwirkung} style={{ width: "fit-content" }}>
              ← Zur Mitwirkung
            </Link>
            <h1 className="hero-title">Projekt mitmachen</h1>
            <p className="body-text muted-text section-lead">
              Hier kannst du Interesse an Beta, Pilot, Feedback, Updates oder Zusammenarbeit melden.
              Nutze das Formular für Mitwirkung, Pilotierung oder fachliches Feedback.
            </p>
          </Stack>
        </Container>
      </SectionFrame>

      <SectionFrame compact>
        <Container>
          <ContentCard>
            <MitwirkenForm />
          </ContentCard>
        </Container>
      </SectionFrame>
    </>
  );
}
