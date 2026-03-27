import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type ContainerProps = {
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "className" | "children">;

export function Container({ children, className, ...rest }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
