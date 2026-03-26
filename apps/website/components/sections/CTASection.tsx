import Link from "next/link";

import { Container } from "../layout/Container";

export function CTASection() {
  return (
    <section id="cta" className="section">
      <Container>
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, #0f1b2d 0%, #16243b 56%, #1f2f49 100%)",
            color: "#f5f7fb",
            borderColor: "rgba(255,255,255,0.08)",
            textAlign: "center",
            padding: "3rem 1.5rem",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              padding: "0.45rem 0.8rem",
              borderRadius: "999px",
              background: "rgba(240, 180, 76, 0.14)",
              color: "#f0b44c",
              fontSize: "0.85rem",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Naechster Schritt
          </span>
          <h2 style={{ marginTop: "1rem", fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Sei dabei, wenn ResQBrain auf die ersten Wachen kommt.
          </h2>
          <p style={{ margin: "1rem auto 0", maxWidth: "42rem", color: "rgba(245,247,251,0.76)" }}>
            Wir suchen Einsatzkraefte, die die App im Alltag testen und den Funktionsumfang
            mitbestimmen wollen.
          </p>
          <div className="button-row" style={{ justifyContent: "center", marginTop: "2rem" }}>
            <a className="button-primary" href="mailto:pilot@resqbrain.de">
              Fruehzugang anfragen
            </a>
            <a className="button-secondary" href="#features">
              Funktionen mitbestimmen
            </a>
          </div>
          <p
            style={{
              margin: "1.25rem auto 0",
              maxWidth: "42rem",
              fontSize: "0.85rem",
              lineHeight: 1.55,
              color: "rgba(245,247,251,0.55)",
            }}
          >
            Mit Absenden akzeptierst du die{" "}
            <Link
              href="/datenschutz"
              style={{
                color: "#f0b44c",
                textDecoration: "underline",
                textUnderlineOffset: "0.15em",
              }}
            >
              Datenschutzerklärung
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
