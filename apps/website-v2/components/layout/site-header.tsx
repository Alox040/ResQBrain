import Link from "next/link";

import { routes } from "@/lib/routes";
import { siteContent } from "@/lib/site/site-content";

export function SiteHeader() {
  return (
    <header>
      <Link href={routes.home}>{siteContent.name}</Link>
    </header>
  );
}
