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
const cardHoverStyle = {
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  transition: "all 0.2s ease",
} as const;

export function ContentCard({ title, children, footer, className = "" }: ContentCardProps) {
  return (
    <div
      className={`${cardClass} ${className}`.trim()}
      style={cardHoverStyle}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(-2px)";
        el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
        el.style.borderColor = "color-mix(in srgb, var(--ems-accent) 40%, transparent)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = "";
        el.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)";
        el.style.borderColor = "";
      }}
    >
      <h3 className={cardTitleClass}>{title}</h3>
      <div className={cardBodyClass}>{children}</div>
      {footer ? <div className="mt-auto shrink-0 pt-1">{footer}</div> : null}
    </div>
  );
}
