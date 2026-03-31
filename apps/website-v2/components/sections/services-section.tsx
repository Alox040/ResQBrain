import { Container } from "@/components/ui/container";
import { SectionFrame } from "@/components/ui/section-frame";

export function ServicesSection() {
  return (
    <SectionFrame id="leistungen">
      <Container>
        <h2 className="home-heading">Unsere Leistungen</h2>
        <div className="home-grid home-grid--three">
          <article className="home-card">
            <h3>Medizinische Inhalte</h3>
            <p>Praxisnahe Aufbereitung von Algorithmen, Medikamenten und Einsatzwissen.</p>
          </article>
          <article className="home-card">
            <h3>Operative Orientierung</h3>
            <p>Klare Leitlinien fuer Entscheidungen im Einsatz- und Schichtalltag.</p>
          </article>
          <article className="home-card">
            <h3>Kontinuierliche Pflege</h3>
            <p>Geordnete Aktualisierung, damit Informationen verlaesslich aktuell bleiben.</p>
          </article>
        </div>
      </Container>
    </SectionFrame>
  );
}
