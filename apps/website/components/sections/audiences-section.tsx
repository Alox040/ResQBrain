import { SectionFrame } from "@/components/sections/section-frame";
import { ContentCard } from "@/components/ui/content-card";

const audiences = [
  {
    title: "Rettungsdienstpersonal & Notfallmedizin",
    body:
      "Einsatzkräfte, die Dosierungen, Algorithmen und Vorgaben schnell brauchen — auch wenn das Netz schwächelt oder ausfällt.",
  },
  {
    title: "Organisationen & Leitung",
    body:
      "Teams, die ihre Inhalte einheitlich pflegen, freigeben und ausrollen wollen, ohne für jede Änderung parallele Informationskanäle zu öffnen.",
  },
  {
    title: "Pilotpartner",
    body:
      "Organisationen, die mit klar abgegrenztem Umfang ausprobieren möchten, wie Inhalte technisch und prozessual an die Praxis angebunden werden.",
  },
  {
    title: "Feedbackgeber & Fachkreise",
    body:
      "Alle, die Anregungen, Lückenhinweise oder strukturierte Rückmeldungen liefern — etwa über Umfrage oder direkten Kontakt.",
  },
] as const;

export function AudiencesSection() {
  return (
    <SectionFrame
      id="zielgruppen"
      variant="surface"
      eyebrow="Zielgruppen"
      title="Für wen ResQBrain gedacht ist"
      description={
        <p>
          Der Fokus liegt auf seriöser Unterstützung im Rettungs- und Notfallkontext — nicht auf
          Marketingversprechen für ein fertiges Endprodukt.
        </p>
      }
    >
      <ul className="grid list-none gap-4 p-0 sm:grid-cols-2 sm:gap-5">
        {audiences.map((a) => (
          <li key={a.title} className="min-w-0">
            <ContentCard title={a.title}>{a.body}</ContentCard>
          </li>
        ))}
      </ul>
    </SectionFrame>
  );
}
