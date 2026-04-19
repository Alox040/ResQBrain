import type { HTMLAttributes, ReactNode } from "react";

type CardPadding = "default" | "wide";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: CardPadding;
}

function joinClasses(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function getPaddingClassName(padding: CardPadding): string {
  return padding === "wide" ? "p-6 sm:p-10" : "p-6";
}

export function Card({
  children,
  padding = "default",
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={joinClasses(
        "rounded-3xl border border-zinc-800/70 bg-zinc-900/30 shadow-[0_24px_64px_rgba(0,0,0,0.28)]",
        getPaddingClassName(padding),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
