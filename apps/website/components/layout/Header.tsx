import { Container } from "./Container";
import { Navigation } from "./Navigation";

export function Header() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(18px)",
        background: "rgba(8, 17, 31, 0.82)",
      }}
    >
      <Container>
        <div
          style={{
            minHeight: "4.5rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            padding: "0.9rem 0",
          }}
        >
          <a href="/" style={{ color: "#f5f7fb", fontSize: "1.1rem", fontWeight: 800 }}>
            ResQBrain
          </a>
          <Navigation />
        </div>
      </Container>
    </header>
  );
}
