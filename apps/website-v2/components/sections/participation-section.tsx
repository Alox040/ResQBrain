import Link from "next/link";

import { Container } from "@/components/ui/container";
import { SectionFrame } from "@/components/ui/section-frame";
import { survey } from "@/lib/site/survey";

export function ParticipationSection() {
  return (
    <SectionFrame id="participation">
      <Container>
        <h2>Participation</h2>
        <Link href={survey.href}>{survey.label}</Link>
      </Container>
    </SectionFrame>
  );
}
