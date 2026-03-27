import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Container } from "../layout/Container";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";

type SurveyItem = {
  id: string;
  title: string;
  status: "active" | "completed";
  link: string;
  cta: string;
  note?: string;
};

const surveys: SurveyItem[] = [
  {
    id: "survey-002",
    title: "Funktionspriorisierung",
    status: "active",
    link: "https://forms.cloud.microsoft/r/tw508dTuDK",
    cta: "An Umfrage teilnehmen",
    note: "Aktiv",
  },
  {
    id: "survey-001",
    title: "Bedarfsanalyse Rettungsdienst App",
    status: "completed",
    link: "https://forms.cloud.microsoft/r/quaHYEbjAC",
    cta: "Ergebnisse ansehen",
    note: "Abgeschlossen",
  },
];

export function SurveysSection() {
  return (
    <Section id="surveys">
      <Container>
        <SectionHeader
          title="Umfragen"
          description="Kurzfeedback aus dem Rettungsdienst. Aktiv zuerst, abgeschlossene Runde danach."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {surveys.map((survey) => (
            <Card key={survey.id} padding="comfortable">
              <div className="flex items-start justify-between gap-4">
                <h3 className="m-0 text-[1.05rem] font-semibold text-foreground">{survey.title}</h3>
                <span className="rounded-md border border-border bg-surface-muted px-2 py-1 text-xs text-muted">
                  {survey.note}
                </span>
              </div>
              <div className="mt-5">
                <Button
                  variant={survey.status === "active" ? "primary" : "outline"}
                  href={survey.link}
                  className="w-full sm:w-auto"
                >
                  {survey.cta}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
