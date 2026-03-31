import type { ReactNode } from "react";

type TypographyProps = {
  children: ReactNode;
  className?: string;
};

export function Heading1({ children, className = "" }: TypographyProps) {
  return <h1 className={`text-balance text-4xl font-semibold tracking-tight sm:text-5xl ${className}`}>{children}</h1>;
}

export function Heading2({ children, className = "" }: TypographyProps) {
  return <h2 className={`text-2xl font-semibold tracking-tight sm:text-3xl ${className}`}>{children}</h2>;
}

export function Lead({ children, className = "" }: TypographyProps) {
  return <p className={`text-lg text-[var(--color-muted)] sm:text-xl ${className}`}>{children}</p>;
}

export function Body({ children, className = "" }: TypographyProps) {
  return <p className={`text-base leading-7 text-[var(--color-foreground)] ${className}`}>{children}</p>;
}
