import type { SiteMetadata } from "@/types/site-content";

import { siteContent } from "@/lib/site/site-content";

export const siteMetadata: SiteMetadata = {
  title: siteContent.title,
  description: siteContent.description,
  locale: "de-DE",
};

export type PublicSiteMetadata = SiteMetadata;
