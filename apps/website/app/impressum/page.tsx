import { ContentCard } from "@/components/ui/content-card";
import { PageHeader } from "@/components/ui/page-header";
import { Stack } from "@/components/ui/stack";
import { contact } from "@/lib/site/contact";

export default function ImpressumPage() {
  return (
    <Stack gap="lg">
      <PageHeader title="Impressum" />
      <ContentCard>
        <Stack gap="sm">
          <h2 className="section-title">Angaben gemäß § 5 TMG</h2>
          <p className="body-text muted-text">
            <strong>Projekt:</strong>
            <br />
            ResQBrain
          </p>
          <p className="body-text muted-text">
            <strong>Verantwortlich:</strong>
            <br />
            {contact.name}
          </p>
          <p className="body-text muted-text">
            <strong>Kontakt:</strong>
            <br />
            E-Mail:
            <br />
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </p>
          <p className="body-text muted-text">
            <strong>Hinweis:</strong>
            <br />
            Dies ist ein nicht-kommerzielles Projekt in früher Phase.
          </p>
        </Stack>
      </ContentCard>
    </Stack>
  );
}
