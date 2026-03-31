import type { Metadata } from "next";
import Link from "next/link";

import { SurveyCtaLink } from "@/components/links/survey-cta-link";
import { SimpleDocument } from "@/components/pages/simple-document";
import {
  firstSurveyResultsUrlFromCode,
  hasPublishedSurveyUrl,
  surveyClosedDocumentationUrlFromCode,
} from "@/lib/public-config";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Mitwirkung",
  description:
    "Projektstand, Kurzumfrage und Kontaktwege für Rückmeldungen und Pilotinteresse — ResQBrain.",
};

export default function MitwirkungPage() {
  const surveyLive = hasPublishedSurveyUrl();
  return (
    <main>
      <SimpleDocument
        title="Mitwirkung & Projektstand"
        description="ResQBrain befindet sich in einer frühen Phase. Hier sind Zugang zur Kurzumfrage und die logischen nächsten Schritte gebündelt — ohne Formulare auf dieser Website."
      >
        <h2 className="text-lg font-semibold text-[var(--color-foreground)]">Projektstand</h2>
        <p>
          Gegenstand ist die Weiterentwicklung einer Plattform-Idee für versionierte medizinische und
          operative Inhalte im Rettungsdienstkontext. Es gibt keinen produktiven Dienst im Sinne eines
          frei zugänglichen Endprodukts; es werden keine Zugangsdaten oder Patientendaten über diese
          Website erhoben.
        </p>

        <h2 id="umfrage" className="scroll-mt-20 text-lg font-semibold text-[var(--color-foreground)]">
          Kurzumfrage (aktiv)
        </h2>
        <p>
          {surveyLive ? (
            <>
              Die aktuelle Umfrage wird über Microsoft Forms bereitgestellt. Beim Öffnen verlassen
              Sie diese Website; es gelten die Hinweise des Betreibers. Die vorherige Umfrage ist
              abgeschlossen. Neue Umfrage jetzt aktiv.
            </>
          ) : (
            <>
              Die Umfrage-URL kann zentral über{" "}
              <code className="rounded bg-[var(--color-surface-muted)] px-1.5 py-0.5 text-sm">
                lib/public-config.ts
              </code>{" "}
              oder{" "}
              <code className="rounded bg-[var(--color-surface-muted)] px-1.5 py-0.5 text-sm">
                NEXT_PUBLIC_RESQBRAIN_SURVEY_URL
              </code>{" "}
              überschrieben werden.
            </>
          )}
        </p>
        {surveyLive ? (
          <p>
            <SurveyCtaLink className="font-medium text-[var(--color-primary)] underline-offset-4 hover:underline">
              Aktive Umfrage öffnen
            </SurveyCtaLink>
          </p>
        ) : (
          <p className="text-sm text-[var(--color-muted)]">
            Kein HTTPS-Link aktiv — Umfrage-CTAs verweisen intern weiter.
          </p>
        )}

        <h2 className="text-lg font-semibold text-[var(--color-foreground)]">Abgeschlossene Umfrage</h2>
        <p>
          Eine frühere Erhebung ist beendet; neue Antworten sind dort nicht mehr möglich. Der Link
          dient zur Transparenz über die verwendete Formulierung (Microsoft Forms).
        </p>
        <a
          href={firstSurveyResultsUrlFromCode}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block text-xs text-muted-foreground hover:underline"
        >
          Ergebnisse der ersten Umfrage ansehen
        </a>
        <p>
          <a
            href={surveyClosedDocumentationUrlFromCode}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--color-primary)] underline-offset-4 hover:underline"
          >
            {surveyClosedDocumentationUrlFromCode}
          </a>
        </p>

        <h2 className="text-lg font-semibold text-[var(--color-foreground)]">Pilotbetrieb &amp; Kontakt</h2>
        <p>
          Für organisatorische Rückfragen, Pilotinteresse oder freie Schilderungen aus der Praxis
          nutzen Sie die Kontaktseite (E-Mail und Adresse wie im Impressum).
        </p>
        <p>
          <Link
            href={routes.kontakt}
            className="font-medium text-[var(--color-primary)] underline-offset-4 hover:underline"
          >
            Zur Kontaktseite
          </Link>
        </p>
      </SimpleDocument>
    </main>
  );
}
