import Link from "next/link";

import { SurveyCtaLink } from "@/components/links/survey-cta-link";
import { SectionFrame } from "@/components/sections/section-frame";
import { ContentCard } from "@/components/ui/content-card";
import { linkTextClass } from "@/components/ui/patterns";
import { hasPublishedSurveyUrl } from "@/lib/public-config";
import { routes } from "@/lib/routes";

export function PilotFeedbackSection() {
  const surveyLive = hasPublishedSurveyUrl();
  return (
    <SectionFrame
      id="pilot-feedback"
      variant="band"
      even
      eyebrow="Kooperation"
      title="Pilotpartnerschaft, Feedback und Kontakt"
      description={
        <p>
          Wir suchen keine breite Markteinführung, sondern gezielte Gespräche und begleitete
          Erprobung. Wenn Ihre Organisation pilotieren oder sich nur austauschen möchte, erreichen
          Sie uns über die Kontaktseite. Die Kurzumfrage hilft, wiederkehrende Themen zu Priorität
          und Nutzung zu bündeln (Zugang siehe unten bzw. Seite Mitwirkung, wenn noch kein externer
          Link aktiv ist).
        </p>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        <ContentCard
          title="Pilotbetrieb"
          footer={
            <Link href={routes.kontakt} className={`${linkTextClass} block py-1`}>
              Kontakt aufnehmen
            </Link>
          }
        >
          Abgrenzbare Testumfänge, klare Erwartungen und enger Austausch während der Erprobung.
        </ContentCard>
        <ContentCard
          title="Umfrage & Signale"
          footer={
            <SurveyCtaLink className={`${linkTextClass} block py-1`}>
              {surveyLive ? "Zur Umfrage" : "Umfrage: Zugang"}
            </SurveyCtaLink>
          }
        >
          Strukturierte Rückmeldungen zu Bedarf, Arbeitsweise und Prioritäten.
        </ContentCard>
        <ContentCard
          title="Direkter Kontakt"
          footer={
            <Link href={routes.kontakt} className={`${linkTextClass} block py-1`}>
              Zur Kontaktseite
            </Link>
          }
        >
          Für Hinweise ohne Formularpflicht — Angaben und erreichbare Kanäle siehe Kontaktseite.
        </ContentCard>
      </div>
    </SectionFrame>
  );
}
