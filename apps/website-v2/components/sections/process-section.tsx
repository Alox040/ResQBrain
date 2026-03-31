import { Container } from "@/components/ui/container";
import { SectionFrame } from "@/components/ui/section-frame";

const processSteps = [
  {
    title: "1. Bedarf verstehen",
    description: "Wir analysieren gemeinsam, welche Inhalte im Team wirklich benoetigt werden.",
  },
  {
    title: "2. Inhalte strukturieren",
    description: "Wissen wird in ruhige, leicht erfassbare Bausteine aufgeteilt.",
  },
  {
    title: "3. Sicher bereitstellen",
    description: "Die Ergebnisse werden verstaendlich publiziert und regelmaessig gepflegt.",
  },
] as const;

export function ProcessSection() {
  return (
    <SectionFrame id="prozess">
      <Container>
        <h2 className="home-heading">So laeuft die Zusammenarbeit</h2>
        <div className="home-grid home-grid--three">
          {processSteps.map((step) => (
            <article key={step.title} className="home-card">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </SectionFrame>
  );
}
