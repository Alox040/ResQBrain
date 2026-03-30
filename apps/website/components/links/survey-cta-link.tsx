import Link from "next/link";
import type { ComponentProps } from "react";

import { resolveSurveyLink } from "@/lib/routes";

export type SurveyCtaLinkProps = Omit<ComponentProps<typeof Link>, "href">;

/**
 * Einheitliches Umfrage-Ziel: konfigurierte HTTPS-URL oder `/mitwirkung#umfrage`.
 */
export function SurveyCtaLink(props: SurveyCtaLinkProps) {
  const { href, external } = resolveSurveyLink();
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    />
  );
}
