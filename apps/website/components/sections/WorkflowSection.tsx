import { Container } from "../layout/Container";

const workflow = [
  {
    step: "01",
    title: "Inhalte erfassen",
    text: "Algorithmen, SOPs und Medikationswissen werden strukturiert angelegt.",
  },
  {
    step: "02",
    title: "Pruefen und freigeben",
    text: "Verantwortliche Teams kontrollieren Versionen und markieren freigegebene Inhalte.",
  },
  {
    step: "03",
    title: "Im Einsatz nutzen",
    text: "Mitarbeitende greifen ueber die Website schnell auf die passende Information zu.",
  },
];

export function WorkflowSection() {
  return (
    <section id="workflow" className="section">
      <Container>
        <div className="section-heading">
          <span className="eyebrow">Ablauf</span>
          <h2 style={{ marginTop: "1rem", fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Von der inhaltlichen Pflege bis zur Nutzung im Einsatz.
          </h2>
        </div>

        <ol className="list-reset card-grid card-grid-3">
          {workflow.map((item) => (
            <li key={item.step} className="card">
              <p style={{ margin: 0, color: "#db3d36", fontWeight: 800 }}>{item.step}</p>
              <h3 style={{ marginTop: "0.9rem", fontSize: "1.15rem" }}>{item.title}</h3>
              <p className="muted" style={{ marginTop: "0.8rem" }}>
                {item.text}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
