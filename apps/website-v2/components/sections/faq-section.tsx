import { Container } from "@/components/ui/container";
import { ContentCard } from "@/components/ui/content-card";
import { SectionFrame } from "@/components/ui/section-frame";

export function FaqSection() {
  return (
    <SectionFrame id="faq">
      <Container>
        <h2>FAQ</h2>
        <ContentCard>
          <p>Frage und Antwort folgen spaeter.</p>
        </ContentCard>
      </Container>
    </SectionFrame>
  );
}
