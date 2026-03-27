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
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(2.8rem, 6vw, 5rem)",
                letterSpacing: "-0.04em",
              }}
            >
              ResQBrain
            </h1>
            <p
              className="muted"
              style={{
                marginTop: "1rem",
                fontSize: "1.25rem",
                maxWidth: "36rem",
                fontWeight: 600,
                color: "var(--text)",
              }}
            >
              Die Wissensplattform fuer den Rettungsdienst
            </p>
            <div
              style={{
                marginTop: "1.2rem",
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              {["Algorithmen", "Medikamente", "SOPs"].map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: "inline-flex",
                    padding: "0.35rem 0.75rem",
                    borderRadius: "999px",
                    border: "1px solid rgba(215, 224, 235, 0.95)",
                    background: "rgba(255,255,255,0.9)",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <ul
              style={{
                marginTop: "1.4rem",
                paddingLeft: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              {["Versioniert", "Organisationsspezifisch", "Schnell im Einsatz verfuegbar"].map(
                (item) => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                    <span style={{ marginTop: "0.1rem" }} aria-hidden="true">
                      -
                    </span>
                    <span>{item}</span>
                  </li>
                ),
              )}
            </ul>
            <p
              className="eyebrow"
              style={{
                marginTop: "1.5rem",
                width: "fit-content",
              }}
            >
              Fruehe Entwicklungsphase — Rueckmeldungen und Pilotkontakt willkommen
            </p>
            <div className="button-row" style={{ marginTop: "2rem" }}>
              <a className="button-secondary" href="/#feedback">
                Feedback geben
              </a>
              <a className="button-primary" href="/#cta">
                Pilotpartner werden
              </a>
            </div>
          </div>

          <aside
            className="card"
            aria-label="Produktfokus"
            style={{
              background: "linear-gradient(180deg, #0f1b2d 0%, #16243b 100%)",
              color: "#f5f7fb",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <p style={{ margin: 0, color: "rgba(245,247,251,0.64)", fontWeight: 700 }}>
              Schwerpunkte
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
                <strong>Algorithmen</strong>
                <p style={{ margin: "0.6rem 0 0", color: "rgba(245,247,251,0.74)" }}>
                  Versioniert.
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
                    Organisationsspezifisch.
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
                    Schnell im Einsatz auffindbar — Zielbild.
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
