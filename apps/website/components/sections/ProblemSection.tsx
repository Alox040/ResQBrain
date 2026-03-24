import { Container } from "../layout/Container";

const problems = [
  "Wissen liegt in PDFs, Chats und lokalen Dateien verteilt.",
  "Aktuelle Versionen sind im Einsatz schwer eindeutig erkennbar.",
  "Organisationen muessen Inhalte an lokale Vorgaben anpassen koennen.",
];

export function ProblemSection() {
  return (
    <section id="problem" className="section">
      <Container>
        <div className="section-heading">
          <span className="eyebrow">Problem</span>
          <h2 style={{ marginTop: "1rem", fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Kritisches Wissen ist oft nicht schnell genug verfuegbar.
          </h2>
          <p className="muted" style={{ marginTop: "1rem" }}>
            In dynamischen Einsatzlagen kostet fragmentierte Information Zeit. Genau dort muss eine
            digitale Wissensplattform stabil, klar und nachvollziehbar funktionieren.
          </p>
        </div>

        <div className="card-grid card-grid-3">
          {problems.map((problem) => (
            <article key={problem} className="card">
              <h3 style={{ fontSize: "1.15rem" }}>Herausforderung</h3>
              <p className="muted" style={{ marginTop: "0.9rem" }}>
                {problem}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
