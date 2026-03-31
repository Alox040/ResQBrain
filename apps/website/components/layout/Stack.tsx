import type { CSSProperties, PropsWithChildren } from "react";

type StackProps = PropsWithChildren<{
  className?: string;
  gap?: CSSProperties["gap"];
}>;

export function Stack({ children, className, gap = "var(--space-5)" }: StackProps) {
  const style: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap,
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
