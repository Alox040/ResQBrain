import Link from "next/link";

import { Container } from "../layout/Container";

const pilotMail = "mailto:pilot@resqbrain.de";
const mail = (subject: string) =>
  `${pilotMail}?subject=${encodeURIComponent(subject)}`;

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
          <h2 style={{ margin: 0, fontSize: "clamp(2rem, 4vw, 3rem)" }}>Mach mit</h2>
          <p style={{ margin: "1rem auto 0", maxWidth: "40rem", color: "rgba(245,247,251,0.88)" }}>
            ResQBrain wird gemeinsam mit der Community entwickelt.
          </p>
          <p style={{ margin: "0.5rem auto 0", maxWidth: "40rem", color: "rgba(245,247,251,0.76)" }}>
            Dein Feedback formt das Produkt.
          </p>
          <div className="button-row" style={{ justifyContent: "center", marginTop: "2rem" }}>
            <a className="button-secondary" href="/#feedback">
              Feedback geben
            </a>
            <a className="button-primary" href={mail("ResQBrain Pilotpartner")}>
              Pilotpartner werden
            </a>
          </div>
          <div
            className="button-row"
            style={{
              justifyContent: "center",
              marginTop: "1rem",
              gap: "1rem 1.25rem",
            }}
          >
            <a
              href={mail("ResQBrain Idee")}
              style={{
                color: "rgba(245,247,251,0.82)",
                fontWeight: 600,
                fontSize: "0.95rem",
                textDecoration: "underline",
                textUnderlineOffset: "0.15em",
              }}
            >
              Idee einreichen
            </a>
            <a
              href="/#status"
              style={{
                color: "rgba(245,247,251,0.82)",
                fontWeight: 600,
                fontSize: "0.95rem",
                textDecoration: "underline",
                textUnderlineOffset: "0.15em",
              }}
            >
              Zum Projektstatus
            </a>
            <a
              href={mail("ResQBrain Community")}
              style={{
                color: "rgba(245,247,251,0.82)",
                fontWeight: 600,
                fontSize: "0.95rem",
                textDecoration: "underline",
                textUnderlineOffset: "0.15em",
              }}
            >
              Community beitreten
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
              Datenschutzerklaerung
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
