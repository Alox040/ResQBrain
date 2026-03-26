import { Container } from "../layout/Container";

const workflow = [
  {
    step: "01",
    title: "App oeffnen",
    text: "Medikament oder Algorithmus aufrufen — Suchergebnis in unter drei Sekunden.",
  },
  {
    step: "02",
    title: "Einsatz begleiten",
    text: "Schritt fuer Schritt durch den Algorithmus. Dosierung immer im Blick. Offline, auch im Funkloch.",
  },
  {
    step: "03",
    title: "Immer aktuelle Inhalte",
    text: "Aenderungen eurer Wache werden automatisch uebertragen, sobald Verbindung besteht.",
  },
];

export function WorkflowSection() {
  return (
    <section id="workflow" className="section">
      <Container>
        <div className="section-heading">
          <span className="eyebrow">Ablauf</span>
          <h2 style={{ marginTop: "1rem", fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Drei Schritte. Kein Overhead.
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
