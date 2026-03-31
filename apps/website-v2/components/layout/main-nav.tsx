import Link from "next/link";

import { mainNav } from "@/lib/routes";

export function MainNav() {
  return (
    <nav>
      <ul>
        {mainNav.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
