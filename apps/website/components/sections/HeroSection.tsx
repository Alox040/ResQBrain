import { Container } from "../layout/Container";

export function HeroSection() {
  return (
    <section
      id="top"
      className="section"
      style={{
        paddingTop: "7rem",
        paddingBottom: "6rem",
      }}
    >
      <Container>
        <div className="hero-grid">
          <div style={{ maxWidth: "42rem" }}>
            <span className="eyebrow">Digitales Wissen fuer den Einsatz</span>
            <h1
              style={{
                marginTop: "1.2rem",
                fontSize: "clamp(2.8rem, 6vw, 5rem)",
                letterSpacing: "-0.04em",
              }}
            >
              Die Wissensplattform fuer schnelle und verlassliche Entscheidungen im Rettungsdienst.
            </h1>
            <p
              className="muted"
              style={{
                marginTop: "1.4rem",
                fontSize: "1.1rem",
                maxWidth: "36rem",
              }}
            >
              ResQBrain verbindet Algorithmen, SOPs, Medikamente und organisationsspezifisches
              Wissen in einer zentralen, versionierten Website fuer Teams im Einsatz.
            </p>
            <div className="button-row" style={{ marginTop: "2rem" }}>
              <a className="button-primary" href="#cta">
                Pilotpartner werden
              </a>
              <a className="button-secondary" href="#features">
                Features ansehen
              </a>
            </div>
          </div>

          <aside
            className="card"
            aria-label="Produktvorschau"
            style={{
              background: "linear-gradient(180deg, #0f1b2d 0%, #16243b 100%)",
              color: "#f5f7fb",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <p style={{ margin: 0, color: "rgba(245,247,251,0.64)", fontWeight: 700 }}>
              Einsatzansicht
            </p>
            <div
              style={{
                marginTop: "1.4rem",
                display: "grid",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "1rem",
                  background: "rgba(255,255,255,0.06)",
                }}
              >
                <strong>Polytrauma Algorithmus</strong>
                <p style={{ margin: "0.6rem 0 0", color: "rgba(245,247,251,0.74)" }}>
                  Versioniert, offline lesbar und mit organisationsspezifischen Anpassungen.
                </p>
              </div>
              <div className="preview-grid">
                <div
                  style={{
                    padding: "1rem",
                    borderRadius: "1rem",
                    background: "rgba(240,180,76,0.14)",
                  }}
                >
                  <strong>Medikamente</strong>
                  <p style={{ margin: "0.5rem 0 0", color: "rgba(245,247,251,0.74)" }}>
                    Dosierungen und Kontraindikationen
                  </p>
                </div>
                <div
                  style={{
                    padding: "1rem",
                    borderRadius: "1rem",
                    background: "rgba(31,157,104,0.14)",
                  }}
                >
                  <strong>SOPs</strong>
                  <p style={{ margin: "0.5rem 0 0", color: "rgba(245,247,251,0.74)" }}>
                    Freigaben und Updates im Blick
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
