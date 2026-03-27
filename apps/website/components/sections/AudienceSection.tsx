import { Container } from "../layout/Container";

const audiences = [
  {
    title: "Fuer den akuten Zugriff",
    text: "Gedacht fuer Einsatzkraefte, die Medikamente und Algorithmen unter Zeitdruck schnell nachschlagen muessen.",
  },
  {
    title: "Pilot-Wache im Fokus",
    text: "Der aktuelle Stand ist auf einen klar begrenzten Pilotkontext mit definierter Inhaltsquelle ausgerichtet.",
  },
  {
    title: "Praxisnah statt administrativ",
    text: "Im Vordergrund steht die operative Nutzung im Einsatz, nicht Organisationsverwaltung oder Governance-Workflows.",
  },
];

export function AudienceSection() {
  return (
    <section id="audience" className="section">
      <Container>
        <div className="section-heading">
          <span className="eyebrow">Zielgruppen</span>
          <h2 style={{ marginTop: "1rem", fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Realistisch zugeschnitten auf den aktuellen Einsatzkontext.
          </h2>
          <p className="muted" style={{ marginTop: "1rem" }}>
            ResQBrain richtet sich am aktuellen Stand vor allem an operative Einsatzkraefte auf
            dem Fahrzeug oder im unmittelbaren Einsatzumfeld.
          </p>
        </div>

        <div className="card-grid card-grid-3">
          {audiences.map((audience) => (
            <article key={audience.title} className="card">
              <h3 style={{ fontSize: "1.15rem" }}>{audience.title}</h3>
              <p className="muted" style={{ marginTop: "0.8rem" }}>
                {audience.text}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
