import { Container } from "@/components/ui/container";
import { SectionFrame } from "@/components/ui/section-frame";

export function RegionSection() {
  return (
    <SectionFrame id="region">
      <Container>
        <h2 className="home-heading">Regional verankert</h2>
        <p className="home-subtitle">
          Wir arbeiten nah an den Anforderungen von Teams in Staedten, Landkreisen und laendlichen
          Regionen. Jede Umgebung braucht klare und passende Informationen.
        </p>
        <div className="home-grid home-grid--two">
          <article className="home-card">
            <h3>Urbaner Raum</h3>
            <p>Unterstuetzung bei hoher Einsatzdichte und komplexen Abstimmungen.</p>
          </article>
          <article className="home-card">
            <h3>Laendliche Region</h3>
            <p>Verlaessliche Orientierung bei grossen Distanzen und begrenzten Ressourcen.</p>
          </article>
        </div>
      </Container>
    </SectionFrame>
  );
}
