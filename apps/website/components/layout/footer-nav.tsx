import Link from "next/link";

import { footerNavigation } from "@/lib/site";

export function FooterNav() {
  return (
    <nav aria-label="Fussnavigation">
      <ul className="footer-nav-list">
        {footerNavigation.map((item) => (
          <li key={item.href}>
            {item.external ? (
              <a className="footer-nav-link" href={item.href} target="_blank" rel="noopener noreferrer">
                {item.label}
              </a>
            ) : (
              <Link className="footer-nav-link" href={item.href}>
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
