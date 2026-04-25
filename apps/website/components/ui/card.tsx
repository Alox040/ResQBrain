import type { HTMLAttributes, ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-zinc-800/70 bg-zinc-900/60 p-6 shadow-sm${className ? ` ${className}` : ""}`}
      {...props}
    >
      {children}
    </div>
  );
}
