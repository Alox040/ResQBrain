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
            <span className="eyebrow">Fuer Einsatzkraefte</span>
            <h1
              style={{
                marginTop: "1.2rem",
                fontSize: "clamp(2.8rem, 6vw, 5rem)",
                letterSpacing: "-0.04em",
              }}
            >
              Einsatzwissen. Ohne Netz. Ohne Umwege.
            </h1>
            <p
              className="muted"
              style={{
                marginTop: "1.4rem",
                fontSize: "1.1rem",
                maxWidth: "36rem",
              }}
            >
              Medikamentendosierungen und Algorithmen — gepruefte Inhalte direkt auf dein Geraet, auch wenn
              kein Mobilfunk verfuegbar ist.
            </p>
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
              <li style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                <span style={{ marginTop: "0.1rem" }}>—</span>
                <span>
                  <strong>Offline-faehig</strong> — voller Zugriff ohne WLAN oder Mobilfunk
                </span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                <span style={{ marginTop: "0.1rem" }}>—</span>
                <span>
                  <strong>Medikamente</strong> — Dosierungen und Kontraindikationen auf einen Blick
                </span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                <span style={{ marginTop: "0.1rem" }}>—</span>
                <span>
                  <strong>Algorithmen</strong> — gepruefte Inhalte eurer Wache, keine Fremddokumente
                </span>
              </li>
            </ul>
            <div className="button-row" style={{ marginTop: "2rem" }}>
              <a className="button-primary" href="#cta">
                Fruehzugang anfragen
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
                  Offline verfuegbar, schnell abrufbar.
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
                  <strong>Algorithmen</strong>
                  <p style={{ margin: "0.5rem 0 0", color: "rgba(245,247,251,0.74)" }}>
                    Schritt fuer Schritt abrufbar
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
