import Link from "next/link";

import { Container } from "@/components/ui/container";
import { SectionFrame } from "@/components/ui/section-frame";
import { contact } from "@/lib/site/contact";
import { routes } from "@/lib/routes";

export function Footer() {
  return (
    <SectionFrame id="footer" compact>
      <Container>
        <div className="home-surface">
          <h2 className="home-heading">ResQBrain</h2>
          <div className="home-footer">
            <Link href={routes.home}>Startseite</Link>
            <Link href={routes.kontakt}>Kontakt</Link>
            <Link href={routes.links}>Weiterfuehrende Links</Link>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </div>
        </div>
      </Container>
    </SectionFrame>
  );
}
