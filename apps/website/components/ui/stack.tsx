import type { CSSProperties, ReactNode } from "react";

import { spacing } from "@/lib/design";

type StackProps = {
  children: ReactNode;
  className?: string;
  gap?: keyof typeof spacing.stack;
};

export function Stack({ children, className, gap = "md" }: StackProps) {
  const style: CSSProperties = {
    display: "grid",
    gap: spacing.stack[gap],
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
