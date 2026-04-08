import Link from "next/link";
import { Container } from "@/components/ui/container";
import { footerLinks, siteMeta } from "@/lib/site-content";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="site-footer__shell">
          <div className="site-footer__meta">
            <p className="site-footer__eyebrow">{siteMeta.labLabel}</p>
            <p className="site-footer__text">{siteMeta.footerText}</p>
            <p className="site-footer__contact">{siteMeta.contactLine}</p>
          </div>

          <nav className="site-footer__nav" aria-label="Footer">
            {footerLinks.map((link) => (
              <Link className="site-footer__link" href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
