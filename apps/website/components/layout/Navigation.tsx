import { siteConfig } from "../../lib/site";

export function Navigation() {
  return (
    <nav aria-label="Hauptnavigation">
      <ul
        className="list-reset"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {siteConfig.navigation.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              style={{
                color: "var(--color-muted)",
                fontSize: "0.9375rem",
                fontWeight: 500,
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
