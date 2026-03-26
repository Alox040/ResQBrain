import { Container } from "../layout/Container";

const audiences = [
  {
    title: "Jederzeit verfuegbar",
    text: "Zuverlaessig abrufbar, auch ohne Mobilfunk oder WLAN.",
  },
  {
    title: "Einheitlicher Stand",
    text: "Alle im Team arbeiten mit demselben, geprueften Informationsstand.",
  },
  {
    title: "Schnell im Einsatz",
    text: "Klare Struktur, schnelle Orientierung — wenn jede Sekunde zaehlt.",
  },
];

export function AudienceSection() {
  return (
    <section id="audience" className="section">
      <Container>
        <div className="section-heading">
          <span className="eyebrow">Zielgruppen</span>
          <h2 style={{ marginTop: "1rem", fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Fuer alle, die im Einsatz auf verlassliche Informationen angewiesen sind.
          </h2>
          <p className="muted" style={{ marginTop: "1rem" }}>
            Von der Besatzung auf dem RTW bis zur aerztlichen Leitung — ResQBrain deckt die
            operative Nutzung und die inhaltliche Verantwortung gemeinsam ab.
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
