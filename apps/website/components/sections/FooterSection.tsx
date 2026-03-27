import { Container } from "../layout/Container";
import { Footer } from "../layout/Footer";
import { siteConfig } from "../../lib/site";

export function FooterSection() {
  return (
    <Footer>
      <div
        id="footer"
        style={{
          background: "var(--color-surface-strong)",
          color: "var(--color-on-strong)",
          padding: "clamp(2rem, 4vw, 2.75rem) 0",
          borderTop: "1px solid color-mix(in srgb, var(--color-on-strong) 18%, var(--color-surface-strong))",
        }}
      >
        <Container>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "1.5rem",
            }}
          >
            <div style={{ maxWidth: "22rem" }}>
              <strong style={{ fontSize: "1rem", color: "var(--color-on-strong)" }}>{siteConfig.name}</strong>
              <p
                style={{
                  margin: "0.4rem 0 0",
                  color: "color-mix(in srgb, var(--color-on-strong) 72%, transparent)",
                  fontSize: "0.9rem",
                  lineHeight: 1.55,
                }}
              >
                Medikamente, Algorithmen, SOP \u2014 lokal, je Organisation.
              </p>
            </div>

            <nav aria-label="Footer Navigation">
              <ul
                className="list-reset"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.75rem 1.25rem",
                  justifyContent: "flex-end",
                }}
              >
                {siteConfig.navigation.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      style={{
                        color: "color-mix(in srgb, var(--color-on-strong) 88%, transparent)",
                        fontSize: "0.9rem",
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="/impressum"
                    style={{
                      color: "color-mix(in srgb, var(--color-on-strong) 88%, transparent)",
                      fontSize: "0.9rem",
                    }}
                  >
                    Impressum
                  </a>
                </li>
                <li>
                  <a
                    href="/datenschutz"
                    style={{
                      color: "color-mix(in srgb, var(--color-on-strong) 88%, transparent)",
                      fontSize: "0.9rem",
                    }}
                  >
                    Datenschutz
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </Container>
      </div>
    </Footer>
  );
}
