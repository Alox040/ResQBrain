import Link from "next/link";

import { footerNavigation } from "@/lib/site";

export function FooterNav() {
  return (
    <nav aria-label="Footer-Navigation">
      <ul>
        {footerNavigation.map((item) => (
          <li key={item.key}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
