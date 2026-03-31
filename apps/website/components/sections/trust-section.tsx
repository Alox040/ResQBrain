import { Container } from "@/components/ui/container";
import { SectionFrame } from "@/components/ui/section-frame";

export function TrustSection() {
  return (
    <SectionFrame id="vertrauen">
      <Container>
        <h2 className="home-heading">Vertrauen entsteht durch Klarheit</h2>
        <p className="home-subtitle">
          Inhalte werden nachvollziehbar gepflegt, strukturiert bereitgestellt und in einfacher
          Sprache vermittelt.
        </p>
        <ul className="home-list">
          <li>Verstaendliche Formulierungen statt Fachjargon ohne Kontext</li>
          <li>Ruhige Darstellung mit grossen Schriftgroessen und klaren Abstaenden</li>
          <li>Eindeutige Orientierung ohne visuelle Ueberladung</li>
        </ul>
      </Container>
    </SectionFrame>
  );
}
