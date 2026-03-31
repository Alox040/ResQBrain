import Link from "next/link";

import { Container } from "@/components/ui/container";
import { SectionFrame } from "@/components/ui/section-frame";
import { routes } from "@/lib/routes";

export function ContactCtaSection() {
  return (
    <SectionFrame id="contact" compact>
      <Container>
        <div className="home-surface">
          <h2 className="home-heading">Kontaktieren Sie uns in Ruhe</h2>
          <p className="home-subtitle">
            Wir melden uns zeitnah und besprechen gemeinsam, wie ResQBrain zu Ihrem Einsatzalltag
            passt.
          </p>
          <Link className="home-cta" href={routes.contact}>
            Jetzt Kontakt aufnehmen
          </Link>
          <p className="home-note">Antwort in klarer Sprache und ohne komplizierte Fachbegriffe.</p>
        </div>
      </Container>
    </SectionFrame>
  );
}
