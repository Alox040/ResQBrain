import { Container } from "../layout/Container";

const problems = [
  "Unterschiedliche Algorithmen je nach Region",
  "Medikamentenlisten nicht zentral gepflegt",
  "SOPs in PDFs oder Dokumenten verteilt",
  "Aenderungen schwer nachvollziehbar",
  "Wissen auf mehrere Quellen verteilt",
  "Keine zentrale Wissensplattform",
];

export function ProblemSection() {
  return (
    <section id="problem" className="section">
      <Container>
        <div className="section-heading">
          <span className="eyebrow">Herausforderung</span>
          <h2 style={{ marginTop: "1rem", fontSize: "clamp(2rem, 4vw, 3rem)" }}>Das Problem</h2>
          <p className="muted" style={{ marginTop: "1rem" }}>
            Wissen im Rettungsdienst ist fragmentiert
          </p>
        </div>

        <div className="card-grid card-grid-3">
          {problems.map((problem) => (
            <article key={problem} className="card">
              <p className="muted" style={{ margin: 0 }}>
                {problem}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
