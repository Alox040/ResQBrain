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
              Kein Suchen. Kein Scrollen. Die richtige Information, wenn es zaehlt.
            </h2>
            <p className="muted" style={{ marginTop: "1rem" }}>
              ResQBrain gibt Einsatzkraeften direkten Zugriff auf Medikamente, Algorithmen und
              gepruefte Inhalte — offline verfuegbar, fuer eine Pilot-Wache konfiguriert, in Sekunden abrufbar.
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
            <h3 style={{ fontSize: "1.2rem" }}>Im Einsatz verfuegbar</h3>
            <ul className="list-reset" style={{ marginTop: "1rem", display: "grid", gap: "0.9rem" }}>
              <li>Medikamente mit Dosierung, Kontraindikationen und Handelsnamen</li>
              <li>Algorithmen als strukturierte Schritt-fuer-Schritt-Ansicht</li>
              <li>Alles offline — auch ohne Netz vollstaendig nutzbar</li>
            </ul>
          </article>
        </div>
      </Container>
    </section>
  );
}
