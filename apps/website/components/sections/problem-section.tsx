import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { SectionFrame } from "@/components/ui/section-frame";
import { homeContent } from "@/lib/site";

export function ProblemSection() {
  return (
    <SectionFrame id="problem">
      <Container>
        <div className="home-panel">
          <SectionHeading title={homeContent.problem.title} eyebrow="Ausgangslage" />
          <p className="body-text muted-text">{homeContent.problem.text}</p>
        </div>
      </Container>
    </SectionFrame>
  );
}
