import { Container } from "./Container";
import { Navigation } from "./Navigation";

export function Header() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        borderBottom: "1px solid var(--color-border)",
        background: "var(--color-surface)",
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
          <a
            href="/"
            style={{ color: "var(--color-foreground)", fontSize: "1.1rem", fontWeight: 600, letterSpacing: "-0.02em" }}
          >
            ResQBrain
          </a>
          <Navigation />
        </div>
      </Container>
    </header>
  );
}
