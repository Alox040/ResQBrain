import { Container } from "../layout/Container";

export function SolutionSection() {
  return (
    <section id="solution" className="section">
      <Container>
        <div className="split-layout">
          <article
            className="card"
            style={{
              background: "linear-gradient(180deg, #ffffff 0%, #f6f8fc 100%)",
            }}
          >
            <span className="eyebrow">Loesung</span>
            <h2 style={{ marginTop: "1rem", fontSize: "clamp(2rem, 4vw, 3rem)" }}>
              Eine zentrale Website fuer versioniertes Einsatzwissen.
            </h2>
            <p className="muted" style={{ marginTop: "1rem" }}>
              ResQBrain strukturiert medizinische und operative Inhalte in klaren Modulen. Teams
              sehen sofort, was freigegeben ist, welche Version gilt und welche Informationen lokal
              angepasst wurden.
            </p>
          </article>

          <article
            className="card"
            style={{
              background: "linear-gradient(180deg, #101b2e 0%, #08111f 100%)",
              color: "#f5f7fb",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <h3 style={{ fontSize: "1.2rem" }}>Was die Plattform leistet</h3>
            <ul className="list-reset" style={{ marginTop: "1rem", display: "grid", gap: "0.9rem" }}>
              <li>Versionierung fuer Algorithmen, SOPs und Medikamente</li>
              <li>Mandantenfaehige Inhalte fuer Regionen und Organisationen</li>
              <li>Klare Freigaben, Aenderungen und Aktualisierungen</li>
            </ul>
          </article>
        </div>
      </Container>
    </section>
  );
}
