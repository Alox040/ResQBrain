import { Container } from "../layout/Container";

const features = [
  {
    title: "Versionierte Inhalte",
    text: "Jede Aenderung bleibt nachvollziehbar. Teams arbeiten mit klar gekennzeichneten Stands.",
  },
  {
    title: "Organisationsspezifische Varianten",
    text: "Leitlinien und SOPs lassen sich auf lokale Vorgaben abbilden, ohne den Kern zu verlieren.",
  },
  {
    title: "Schneller Zugriff",
    text: "Karten, Suchpfade und klare Inhaltsstrukturen reduzieren Reibung im Einsatz.",
  },
  {
    title: "Freigabeprozesse",
    text: "Zustaendigkeiten und Status machen sichtbar, was in Produktion genutzt werden darf.",
  },
  {
    title: "Modulare Architektur",
    text: "Algorithmen, Medikamente und Richtlinien koennen getrennt gepflegt und ausgeliefert werden.",
  },
  {
    title: "Skalierbar fuer Pilot und Rollout",
    text: "Die Website ist fuer erste Pilotpartner ebenso geeignet wie fuer spaetere Expansion.",
  },
];

export function FeatureSection() {
  return (
    <section id="features" className="section">
      <Container>
        <div className="section-heading">
          <span className="eyebrow">Features</span>
          <h2 style={{ marginTop: "1rem", fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Die wichtigsten Bausteine fuer eine belastbare Wissensplattform.
          </h2>
        </div>

        <div className="card-grid card-grid-3">
          {features.map((feature) => (
            <article key={feature.title} className="card">
              <h3 style={{ fontSize: "1.15rem" }}>{feature.title}</h3>
              <p className="muted" style={{ marginTop: "0.8rem" }}>
                {feature.text}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
