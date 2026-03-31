import type { CSSProperties, PropsWithChildren } from "react";

type ContainerProps = PropsWithChildren<{
  className?: string;
  maxWidth?: number;
}>;

export function Container({ children, className, maxWidth = 1100 }: ContainerProps) {
  const style: CSSProperties = {
    width: "min(100% - 2rem, 100%)",
    maxWidth: `${maxWidth}px`,
    marginInline: "auto",
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
