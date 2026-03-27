import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

const paddings = {
  none: "",
  compact: "p-4",
  comfortable: "p-6 md:p-7",
  roomy: "p-8 md:p-10",
} as const;

export type CardPadding = keyof typeof paddings;

type CardProps = {
  children: ReactNode;
  className?: string;
  /** default: weisser Grund; muted/dashed fuer Platzhalter */
  variant?: "default" | "muted" | "dashed";
  padding?: CardPadding;
} & Omit<HTMLAttributes<HTMLDivElement>, "className" | "children">;

export function Card({
  children,
  className,
  variant = "default",
  padding = "comfortable",
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border",
        variant === "default" && "bg-surface",
        (variant === "muted" || variant === "dashed") && "bg-surface-muted",
        variant === "dashed" && "border-dashed",
        paddings[padding],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
