import Link from "next/link";

import { SurveyCtaLink } from "@/components/links/survey-cta-link";
import { SectionFrame } from "@/components/sections/section-frame";
import {
  buttonPrimaryClass,
  buttonSecondaryClass,
  importantHintClass,
} from "@/components/ui/patterns";
import { hasPublishedSurveyUrl, surveyClosedDocumentationUrlFromCode } from "@/lib/public-config";
import { routes } from "@/lib/routes";

export function SurveyInviteSection() {
  const surveyLive = hasPublishedSurveyUrl();
  return (
    <SectionFrame
      id="mitmachen"
      variant="survey"
      eyebrow="Neue Umfrage"
      title="Neue Community Umfrage verfügbar"
      description={
        <>
          <p>
            Hilf mit die nächsten Features zu priorisieren
          </p>
          <p className={importantHintClass}>
            Auswertung erfolgt getrennt von klinischen Freigabeprozessen — Umfragen ersetzen keine
            medizinische Prüfung von Inhalten.
          </p>
        </>
      }
    >
      <div className="flex w-full max-w-lg flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-stretch">
        <SurveyCtaLink className={buttonPrimaryClass}>
          Jetzt teilnehmen
        </SurveyCtaLink>
        <Link href={routes.kontakt} className={buttonSecondaryClass}>
          Kontakt &amp; Rückmeldung
        </Link>
      </div>
      {surveyClosedDocumentationUrlFromCode ? (
        <div>
          <Link href={surveyClosedDocumentationUrlFromCode} target="_blank" rel="noopener noreferrer">
            Ergebnisse der letzten Umfrage ansehen
          </Link>
        </div>
      ) : null}
    </SectionFrame>
  );
}
