import type { HTMLAttributes, ReactNode } from "react";

type SectionContainerProps = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export function SectionContainer({ children, className, ...props }: SectionContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8${className ? ` ${className}` : ""}`}
      {...props}
    >
      {children}
    </div>
  );
}
