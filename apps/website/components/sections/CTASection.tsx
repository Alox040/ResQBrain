import Link from "next/link";

import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Container } from "../layout/Container";
import { Section } from "../ui/Section";

const pilotMail = "mailto:pilot@resqbrain.de";
const mail = (subject: string) => `${pilotMail}?subject=${encodeURIComponent(subject)}`;
const ENABLE_MOBILE_STICKY_CTA = false;

export function CTASection() {
  return (
    <Section id="cta">
      <Container>
        <Card padding="roomy" className="mx-auto max-w-xl text-center">
          <h2 className="m-0 text-[clamp(1.5rem,2.5vw,1.85rem)] font-semibold text-foreground">Kontakt</h2>
          <p className="muted mx-auto mb-0 mt-4 max-w-md text-base leading-[1.55]">
            Pilot oder Rueckmeldung. Kurz reicht.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <Button variant="outline" href={mail("ResQBrain Rueckmeldung")} className="w-full sm:w-auto">
              E-Mail
            </Button>
            <Button variant="primary" href={mail("ResQBrain Pilotpartner")} className="w-full sm:w-auto">
              Pilot
            </Button>
          </div>
          <p className="mx-auto mb-0 mt-6 max-w-md text-xs leading-normal text-muted md:text-[0.85rem] md:leading-normal">
            Hinweise:{" "}
            <Link
              href="/datenschutz"
              className="text-foreground underline decoration-foreground/30 underline-offset-[0.15em] hover:decoration-foreground/60"
            >
              Datenschutz
            </Link>
            .
          </p>
        </Card>
      </Container>
    </Section>
  );
}

export function MobileStickyCTA() {
  if (!ENABLE_MOBILE_STICKY_CTA) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 p-3 backdrop-blur-sm md:hidden">
      <Button variant="primary" href={mail("ResQBrain Pilotpartner")} className="w-full">
        Pilot
      </Button>
    </div>
  );
}
