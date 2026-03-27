import { Container } from "../layout/Container";

const features = [
  {
    title: "Medikamente sofort finden",
    text: "Medikamente schnell ueber Listen und lokale Suche aufrufen, statt im Ordner oder PDF zu suchen.",
  },
  {
    title: "Algorithmen griffbereit",
    text: "Algorithmen strukturiert in Listen- und Detailansichten abrufen - klar lesbar auch unter Zeitdruck.",
  },
  {
    title: "Offline-Zugriff",
    text: "Die statische Datenbasis liegt lokal vor und bleibt ohne Mobilfunk oder WLAN verfuegbar.",
  },
  {
    title: "Klare Detailansichten",
    text: "Wesentliche Informationen stehen direkt in der Ansicht: Dosierungen, Hinweise und Algorithmus-Schritte.",
  },
  {
    title: "Gepruefte Pilot-Inhalte",
    text: "Der aktuelle Stand nutzt eine definierte, gepruefte Inhaltsbasis fuer einen klar begrenzten Pilotkontext.",
  },
  {
    title: "Phase 1 in Vorbereitung",
    text: "Weitere Funktionen wie Rechenhilfen oder Lernansichten sind fuer spaetere Stufen vorgesehen, nicht Teil des kommunizierten Lookup-Umfangs.",
  },
];

export function FeatureSection() {
  return (
    <section id="features" className="section">
      <Container>
        <div className="section-heading">
          <span className="eyebrow">Features</span>
          <h2 style={{ marginTop: "1rem", fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Was der aktuelle Stand abdeckt.
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
