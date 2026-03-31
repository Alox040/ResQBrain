import Link from "next/link";

import { mainNavigation } from "@/lib/site";

export function MainNav() {
  return (
    <nav aria-label="Hauptnavigation">
      <ul className="site-nav-list">
        {mainNavigation.map((item) => (
          <li key={item.href}>
            <Link className="site-nav-link" href={item.href}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
