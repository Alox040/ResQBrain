import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Kein Standard-Blockabstand — nur className steuern (z. B. Hero) */
  flush?: boolean;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children" | "id">;

export function Section({ id, children, className, flush = false, ...rest }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(!flush && "py-16 md:py-24", className)}
      {...rest}
    >
      {children}
    </section>
  );
}
