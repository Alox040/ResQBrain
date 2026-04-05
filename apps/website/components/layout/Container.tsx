import type { CSSProperties, PropsWithChildren } from "react";

type ContainerProps = PropsWithChildren<{
  className?: string;
  maxWidth?: number;
}>;

export function Container({ children, className, maxWidth }: ContainerProps) {
  const style: CSSProperties =
    maxWidth != null
      ? {
          width: `min(100% - (var(--container-padding) * 2), ${maxWidth}px)`,
          marginInline: "auto",
        }
      : {
          width: "min(100% - (var(--container-padding) * 2), var(--container-content))",
          marginInline: "auto",
        };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
