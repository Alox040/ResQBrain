import Link from "next/link";

import { FooterNav } from "@/components/layout/footer-nav";
import { Container } from "@/components/layout/Container";
import { contactInfo } from "@/lib/site/contact-page";
import { siteContent } from "@/lib/site/site-content";
import { routes } from "@/lib/routes";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container maxWidth="wide">
        <div className="site-footer-inner">
          <div className="site-footer-brand">
            <Link className="site-brand" href={routes.home}>
              {siteContent.name}
            </Link>
            <p className="small-text muted-text">
              Digitale Lern- und Nachbereitungsstruktur fuer den Rettungsdienst.
            </p>
          </div>
          <FooterNav />
          <a className="footer-nav-link" href={contactInfo.email.href}>
            {contactInfo.email.label}
          </a>
        </div>
      </Container>
    </footer>
  );
}
