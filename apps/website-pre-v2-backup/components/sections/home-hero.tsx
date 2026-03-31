import Image from "next/image";
import Link from "next/link";
import { SurveyCtaLink } from "@/components/links/survey-cta-link";
import { Container } from "@/components/ui/container";
import { FeedbackButton } from "@/components/ui/feedback-button";
import {
  buttonPrimaryClass,
  buttonSecondaryOutlineClass,
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
      className={`${scrollMarginUnderHeader} relative overflow-hidden border-b border-[var(--color-border)]/80 ${sectionPaddingY}`}
      style={{
        background: "linear-gradient(to bottom, #F8FAFC, #FFFFFF)",
      }}
    >
      <div className="pointer-events-none absolute top-0 left-0 hidden h-[420px] w-[420px] lg:block xl:h-[480px] xl:w-[480px]">
        <Image
          src="/svgs/patterns/pattern-07.svg"
          alt=""
          fill
          loading="lazy"
          className="object-contain object-left-top opacity-[0.035]"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-red-500/5 to-blue-500/5" />
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden lg:block w-[42rem] xl:w-[52rem] 2xl:w-[64rem]">
        <Image
          src="/images/resqbrain-hero.jpg"
          alt=""
          fill
          priority
          className="object-contain object-right opacity-[0.08] blur-sm [mask-image:linear-gradient(to_left,black,transparent)]"
        />
      </div>
      <Container>
        <div className="relative z-10">
          <p className={eyebrowClass}>ResQBrain · in Arbeit</p>
          <h1
            className="mt-3 max-w-[40rem] text-[1.75rem] font-semibold leading-snug tracking-tight text-[var(--color-foreground)] sm:mt-3.5 sm:text-[2.125rem] sm:leading-tight"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--ems-accent-soft) 50%, transparent), transparent 60%)`,
            }}
          >
            Orientierungshilfe für Rettungsdienst und Notfallmedizin — organisationssicher denkbar
          </h1>
          <p className="mt-5 max-w-[42rem] text-[0.9375rem] leading-relaxed text-[var(--color-muted)] sm:text-base sm:leading-relaxed">
            ResQBrain wird als Plattform entwickelt, mit der Organisationen medizinische und
            operative Inhalte versioniert verwalten und verlässlich an die Einsatzpraxis ausspielen
            können. Es handelt sich um ein frühes Projekt; Feedback und Pilotinteresse helfen, die
            Richtung sachlich mitzugestalten.
          </p>
          <div className="mt-8 flex w-full max-w-lg flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-stretch">
            <SurveyCtaLink className={buttonPrimaryClass}>
              {surveyLive ? "Zur Kurzumfrage" : "Kurzumfrage: Zugang & Hinweise"}
            </SurveyCtaLink>
            <Link href={`${routes.home}#mitmachen`} className={buttonSecondaryOutlineClass}>
              Mitwirkung &amp; Kontext
            </Link>
            <FeedbackButton />
          </div>
        </div>
      </Container>
    </section>
  );
}
