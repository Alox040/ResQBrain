import { getNavigationViewModel } from "../../lib/site-selectors";

export function Navigation() {
  const navigationItems = getNavigationViewModel();

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
        {navigationItems.map((item) => (
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
