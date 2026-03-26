import { Container } from "../layout/Container";

const features = [
  {
    title: "Medikamente sofort finden",
    text: "Dosierungen, Kontraindikationen und Handelsnamen auf einen Blick — ohne Scrollen, ohne Suchen.",
  },
  {
    title: "Algorithmen griffbereit",
    text: "Einsatzprotokolle strukturiert und schrittweise abrufbar — auch unter Stress lesbar.",
  },
  {
    title: "Offline-Zugriff",
    text: "Voller Funktionsumfang ohne Mobilfunk oder WLAN — im Keller, auf der Autobahn, im Funkloch.",
  },
  {
    title: "Einsatzmodus",
    text: "Minimale Klicks, maximale Uebersicht. Die Oberflaeche ist fuer Zeitdruck und Handschuhe optimiert.",
  },
  {
    title: "Inhalte eurer Wache",
    text: "Gepruefte Inhalte und Dosierungen eurer Organisation — keine unverifizierten Fremddokumente.",
  },
  {
    title: "Immer aktuell",
    text: "Automatische Updates uebertragen Aenderungen auf alle Geraete, sobald Verbindung besteht.",
  },
];

export function FeatureSection() {
  return (
    <section id="features" className="section">
      <Container>
        <div className="section-heading">
          <span className="eyebrow">Features</span>
          <h2 style={{ marginTop: "1rem", fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Was dein Team im Einsatz braucht.
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
