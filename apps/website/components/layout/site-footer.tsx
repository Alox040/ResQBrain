import Link from "next/link";

import { FooterNav } from "@/components/layout/footer-nav";
import { Container } from "@/components/layout/Container";
import { siteContent } from "@/lib/site/site-content";
import { routes } from "@/lib/routes";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container maxWidth="wide">
        <div
          className="site-footer-inner"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), max-content))",
          }}
        >
          <div className="site-footer-brand">
            <Link className="site-brand" href={routes.home}>
              {siteContent.name}
            </Link>
            <p className="small-text muted-text">
              MVP für strukturierte Wissensarbeit und Nachbereitung im Rettungsdienst.
            </p>
          </div>
          <FooterNav />
        </div>
      </Container>
    </footer>
  );
}
