import type { Metadata } from "next";
import Link from "next/link";

import { SurveyCtaLink } from "@/components/links/survey-cta-link";
import { SimpleDocument } from "@/components/pages/simple-document";
import { hasPublishedSurveyUrl } from "@/lib/public-config";
import { routes } from "@/lib/routes";
import { contactEmail, repositoryUrl } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontaktwege für Pilotinteresse, fachliche Rückmeldungen und Mitwirkung — ResQBrain (ohne Formular).",
};

export default function KontaktPage() {
  const surveyLive = hasPublishedSurveyUrl();
  return (
    <main>
      <SimpleDocument
        title="Kontakt"
        description="Diese Seite ersetzt kein Ticket-System und enthält kein Formular. Für Rückmeldungen nutzen Sie E-Mail oder die Kurzumfrage."
      >
        <p>
          ResQBrain richtet sich an Rettungsdienstpersonal, Organisationen und Pilotpartner. Zum
          Projektstand und zur Umfrage siehe{" "}
          <Link
            href={routes.mitwirkung}
            className="font-medium text-[var(--color-primary)] underline-offset-4 hover:underline"
          >
            Mitwirkung
          </Link>
          .
        </p>

        <h2 className="text-lg font-semibold text-[var(--color-foreground)]">Was Sie hier einreichen können</h2>
        <ul>
          <li>Interesse an einem eingegrenzten Piloten oder Austausch zur Machbarkeit vor Ort.</li>
          <li>Fachliche Hinweise und Bedarfsbeschreibungen (ohne Patienten- oder personenbezogene Daten).</li>
          <li>Rückfragen zu den öffentlich beschriebenen Projektannahmen — keine medizinische Einzelfallberatung.</li>
        </ul>

        <h2 id="umfrage" className="scroll-mt-20 text-lg font-semibold text-[var(--color-foreground)]">
          Kurzumfrage (Microsoft Forms)
        </h2>
        <p>
          {surveyLive
            ? "Die Umfrage läuft außerhalb dieser Website. Beim Öffnen gelten die Datenschutzhinweise des jeweiligen Dienstes."
            : "Öffentlicher Direktlink derzeit nicht gesetzt — siehe Mitwirkung."}
        </p>
        <p>
          <SurveyCtaLink className="font-medium text-[var(--color-primary)] underline-offset-4 hover:underline">
            {surveyLive ? "Zur Umfrage wechseln" : "Hinweise zum Umfrage-Zugang"}
          </SurveyCtaLink>
        </p>

        <h2 className="text-lg font-semibold text-[var(--color-foreground)]">E-Mail</h2>
        <p>
          <a
            href={`mailto:${contactEmail}`}
            className="font-medium text-[var(--color-primary)] underline-offset-4 hover:underline"
          >
            {contactEmail}
          </a>
        </p>

        <h2 className="text-lg font-semibold text-[var(--color-foreground)]">Postanschrift</h2>
        <p>
          Alexander Posdziech
          <br />
          Voßort 14
          <br />
          21037 Hamburg
          <br />
          Deutschland
        </p>
        <p className="text-sm leading-relaxed">
          Adresse wie im Impressum; Telefon wird derzeit nicht ausgewiesen.
        </p>

        <h2 className="text-lg font-semibold text-[var(--color-foreground)]">Quellcode</h2>
        <p>
          <a
            href={repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--color-primary)] underline-offset-4 hover:underline"
          >
            {repositoryUrl}
          </a>
        </p>

        <p className="text-sm leading-relaxed">
          Bitte keine gesundheitlichen Einzelangaben oder vertraulichen Einsatzdetails per E-Mail
          senden, soweit dies vermeidbar ist.
        </p>
      </SimpleDocument>
    </main>
  );
}
