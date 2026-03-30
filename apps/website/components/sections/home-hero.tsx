import Link from "next/link";

import { SurveyCtaLink } from "@/components/links/survey-cta-link";
import { Container } from "@/components/ui/container";
import {
  buttonPrimaryClass,
  buttonSecondaryClass,
  eyebrowClass,
  sectionPaddingY,
  scrollMarginUnderHeader,
} from "@/components/ui/patterns";
import { hasPublishedSurveyUrl } from "@/lib/public-config";
import { routes } from "@/lib/routes";

export function HomeHero() {
  const surveyLive = hasPublishedSurveyUrl();
  return (
    <section
      id="top"
      className={`${scrollMarginUnderHeader} border-b border-[var(--color-border)]/80 bg-[var(--color-surface)] ${sectionPaddingY}`}
    >
      <Container>
        <p className={eyebrowClass}>ResQBrain · in Arbeit</p>
        <h1 className="mt-3 max-w-[40rem] text-[1.75rem] font-semibold leading-snug tracking-tight text-[var(--color-foreground)] sm:mt-3.5 sm:text-[2.125rem] sm:leading-tight">
          Orientierungshilfe für Rettungsdienst und Notfallmedizin — organisationssicher denkbar
        </h1>
        <p className="mt-5 max-w-[42rem] text-[0.9375rem] leading-relaxed text-[var(--color-muted)] sm:text-base sm:leading-relaxed">
          ResQBrain wird als Plattform entwickelt, mit der Organisationen medizinische und operative
          Inhalte versioniert verwalten und verlässlich an die Einsatzpraxis ausspielen können. Es
          handelt sich um ein frühes Projekt; Feedback und Pilotinteresse helfen, die Richtung
          sachlich mitzugestalten.
        </p>
        <div className="mt-8 flex w-full max-w-lg flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-stretch">
          <SurveyCtaLink className={buttonPrimaryClass}>
            {surveyLive ? "Zur Kurzumfrage" : "Kurzumfrage: Zugang & Hinweise"}
          </SurveyCtaLink>
          <Link href={`${routes.home}#mitmachen`} className={buttonSecondaryClass}>
            Mitwirkung &amp; Kontext
          </Link>
        </div>
      </Container>
    </section>
  );
}
