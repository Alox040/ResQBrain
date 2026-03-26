import { Container } from "../layout/Container";

const problems = [
  "Im Einsatz keine Zeit zum Suchen — die Information muss sofort da sein.",
  "Kein Mobilfunk, kein Zugriff — klassische Tools versagen genau dann, wenn es zaehlt.",
  "Generische Inhalte passen nicht — jede Wache arbeitet nach eigenen Vorgaben.",
];

export function ProblemSection() {
  return (
    <section id="problem" className="section">
      <Container>
        <div className="section-heading">
          <span className="eyebrow">Problem</span>
          <h2 style={{ marginTop: "1rem", fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Im Einsatz zaehlt jede Sekunde.
          </h2>
          <p className="muted" style={{ marginTop: "1rem" }}>
            Die Dosierung. Der naechste Schritt im Algorithmus. Das lokale Protokoll. Wer dafuer
            suchen muss, verliert Zeit — Zeit, die im Einsatz fehlt.
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
