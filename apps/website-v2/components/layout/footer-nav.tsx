import Link from "next/link";

import { footerNav } from "@/lib/routes";

export function FooterNav() {
  return (
    <nav>
      <ul>
        {footerNav.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
