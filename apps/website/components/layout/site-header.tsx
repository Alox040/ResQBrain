import Link from "next/link";

import { MainNav } from "@/components/layout/main-nav";
import { Container } from "@/components/ui/container";
import { siteContent } from "@/lib/site/site-content";
import { routes } from "@/lib/routes";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Container maxWidth="wide">
        <div className="site-header-inner">
          <Link className="site-brand" href={routes.home}>
            {siteContent.name}
          </Link>
          <MainNav />
        </div>
      </Container>
    </header>
  );
}
