import { Container } from "../layout/Container";
import { Footer } from "../layout/Footer";
import { siteConfig } from "../../lib/site";

export function FooterSection() {
  return (
    <Footer>
      <div
        style={{
          background: "#08111f",
          color: "#f5f7fb",
          padding: "2.5rem 0",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Container>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <div>
              <strong>{siteConfig.name}</strong>
              <p style={{ margin: "0.5rem 0 0", color: "rgba(245,247,251,0.68)" }}>
                Wissensplattform fuer versionierte Inhalte im Rettungsdienst.
              </p>
            </div>

            <nav aria-label="Footer Navigation">
              <ul
                className="list-reset"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                  justifyContent: "center",
                }}
              >
                {siteConfig.navigation.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} style={{ color: "rgba(245,247,251,0.8)" }}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Container>
      </div>
    </Footer>
  );
}
