import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${className}`}
      style={{ maxWidth: "var(--container-max, 1200px)" }}
    >
      {children}
    </div>
  );
}
