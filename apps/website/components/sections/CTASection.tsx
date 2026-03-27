import { ArrowRight, Mail } from "lucide-react";

import { Container } from "../layout/Container";
import { Button } from "../ui/Button";
import { getContactViewModel } from "../../lib/site-selectors";

const ENABLE_MOBILE_STICKY_CTA = false;

export function CTASection() {
  const contact = getContactViewModel();

  return (
    <section id="cta" className="bg-white py-16">
      <Container>
        <div className="overflow-hidden rounded-3xl border-8 border-red-500 bg-gradient-to-br from-red-600 to-red-700 shadow-2xl">
          <div className="p-12 text-center lg:p-16">
            <h2 className="mb-8 text-5xl font-black text-white md:text-7xl">Jetzt testen</h2>
            <p className="mx-auto mb-12 max-w-3xl text-2xl font-bold text-white md:text-3xl">
              Werden Sie Early-Adopter
            </p>

            <div className="mx-auto mb-12 max-w-2xl space-y-4 text-left">
              {["Kostenlos testen", "Direktes Feedback", "Mitgestalten"].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-xl border-4 border-white/40 bg-white/20 p-5 backdrop-blur-sm"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white">
                    <div className="h-3 w-3 rounded-full bg-red-600" />
                  </div>
                  <p className="text-xl font-bold text-white md:text-2xl">{item}</p>
                </div>
              ))}
            </div>

            <div className="mx-auto flex max-w-lg flex-col gap-5">
              <Button
                href={contact.contactHref}
                className="h-20 rounded-2xl border-4 border-white bg-white text-2xl font-black text-red-700 shadow-2xl hover:bg-gray-100"
              >
                <Mail className="mr-3 h-8 w-8" strokeWidth={3} />
                Kontakt aufnehmen
              </Button>
              <Button
                href={contact.learnMoreHref}
                variant="outline"
                className="h-16 rounded-2xl border-4 border-white bg-white/10 text-xl font-bold text-white backdrop-blur-sm hover:bg-white/20"
              >
                Mehr erfahren
                <ArrowRight className="ml-2 h-6 w-6" strokeWidth={3} />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function MobileStickyCTA() {
  if (!ENABLE_MOBILE_STICKY_CTA) return null;

  const contact = getContactViewModel();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 p-3 backdrop-blur-sm md:hidden">
      <Button variant="primary" href={contact.pilotHref} className="w-full">
        Pilot
      </Button>
    </div>
  );
}
