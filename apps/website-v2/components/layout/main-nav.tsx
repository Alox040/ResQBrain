import Link from "next/link";

import { mainNavigation } from "@/lib/site";

export function MainNav() {
  return (
    <nav aria-label="Hauptnavigation">
      <ul>
        {mainNavigation.map((item) => (
          <li key={item.key}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
