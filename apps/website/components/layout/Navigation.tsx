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
                color: "rgba(245, 247, 251, 0.88)",
                fontSize: "0.95rem",
                fontWeight: 600,
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
