import Link from "next/link";
import { SiteNav } from "@/components/layout/site-nav";
import { Container } from "@/components/ui/container";
import { siteMeta } from "@/lib/site-content";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Container>
        <div className="site-header__shell">
          <Link className="brand" href="/">
            <span className="brand__mark" aria-hidden="true">
              RQ
            </span>
            <span className="brand__copy">
              <span className="brand__eyebrow">{siteMeta.labLabel}</span>
              <span className="brand__title">{siteMeta.name}</span>
              <span className="brand__subtitle">{siteMeta.tagline}</span>
            </span>
          </Link>
          <SiteNav />
        </div>
      </Container>
    </header>
  );
}
