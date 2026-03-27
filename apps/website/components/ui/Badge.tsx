import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type BadgeProps = {
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLSpanElement>, "className" | "children">;

export function Badge({ children, className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-muted",
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
