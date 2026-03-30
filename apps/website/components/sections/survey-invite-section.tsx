import Link from "next/link";

import { SurveyCtaLink } from "@/components/links/survey-cta-link";
import { SectionFrame } from "@/components/sections/section-frame";
import { buttonPrimaryClass, buttonSecondaryClass } from "@/components/ui/patterns";
import { hasPublishedSurveyUrl } from "@/lib/public-config";
import { routes } from "@/lib/routes";

export function SurveyInviteSection() {
  const surveyLive = hasPublishedSurveyUrl();
  return (
    <SectionFrame
      id="mitmachen"
      variant="band"
      eyebrow="Mitmachen"
      title="Ihre Erfahrung zählt — Kurzumfrage und Rückmeldungen"
      description={
        <>
          <p>
            Für den weiteren Aufbau brauchen wir belastbare Signale aus der Praxis: Was fehlt im
            Einsatz? Welche Inhalte müssen offline verfügbar sein? Wo wird Zeit verloren? Die Umfrage
            ist bewusst kurz gehalten; wer lieber frei texten möchte, kann uns alternativ direkt
            kontaktieren.
          </p>
          <p className="border-l-2 border-[var(--color-primary)]/25 pl-3 text-sm leading-relaxed text-[var(--color-muted)]">
            Auswertung erfolgt getrennt von klinischen Freigabeprozessen — Umfragen ersetzen keine
            medizinische Prüfung von Inhalten.
          </p>
        </>
      }
    >
      <div className="flex w-full max-w-lg flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-stretch">
        <SurveyCtaLink className={buttonPrimaryClass}>
          {surveyLive ? "Umfrage öffnen (externer Link)" : "Umfrage-Zugang (Stand & nächste Schritte)"}
        </SurveyCtaLink>
        <Link href={routes.kontakt} className={buttonSecondaryClass}>
          Kontakt &amp; Rückmeldung
        </Link>
      </div>
    </SectionFrame>
  );
}
