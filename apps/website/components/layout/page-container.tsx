import type { ReactNode } from "react";

export interface PageContainerProps {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg";
  className?: string;
}

function joinClasses(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function getMaxWidthClassName(maxWidth: NonNullable<PageContainerProps["maxWidth"]>): string {
  switch (maxWidth) {
    case "sm":
      return "max-w-2xl";
    case "md":
      return "max-w-4xl";
    case "lg":
      return "max-w-6xl";
  }
}

export function PageContainer({
  children,
  maxWidth = "md",
  className,
}: PageContainerProps) {
  return (
    <div
      className={joinClasses(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        getMaxWidthClassName(maxWidth),
        className,
      )}
    >
      {children}
    </div>
  );
}
