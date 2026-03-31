import Link from "next/link";

import { Container } from "@/components/ui/container";
import { SectionFrame } from "@/components/ui/section-frame";
import { routes } from "@/lib/routes";

export function ContactCtaSection() {
  return (
    <SectionFrame id="contact">
      <Container>
        <h2>Kontakt</h2>
        <Link href={routes.contact}>Kontakt aufnehmen</Link>
      </Container>
    </SectionFrame>
  );
}
