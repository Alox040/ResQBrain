import type { HTMLAttributes, ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLSpanElement>;

export function Badge({ children, className, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-200${className ? ` ${className}` : ""}`}
      {...props}
    >
      {children}
    </span>
  );
}
