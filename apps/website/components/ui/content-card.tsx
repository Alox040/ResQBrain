import type { ReactNode } from "react";

import { cardBodyClass, cardClass, cardTitleClass } from "@/components/ui/patterns";

type ContentCardProps = {
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

/**
 * Einheitliche Inhaltskarte für Raster auf der Startseite.
 */
export function ContentCard({ title, children, footer, className = "" }: ContentCardProps) {
  return (
    <div className={`content-card-lift ${cardClass} ${className}`.trim()}>
      <h3 className={cardTitleClass}>{title}</h3>
      <div className={cardBodyClass}>{children}</div>
      {footer ? <div className="mt-auto shrink-0 pt-1">{footer}</div> : null}
    </div>
  );
}
