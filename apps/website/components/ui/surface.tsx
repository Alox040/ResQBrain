import type { CSSProperties, ElementType, ReactNode } from "react";

import { surfaces } from "@/lib/design";

type SurfaceProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  surface?: keyof typeof surfaces;
  padding?: string;
};

export function Surface({
  children,
  className,
  as: Component = "div",
  surface = "base",
  padding,
}: SurfaceProps) {
  const surfaceStyle = surfaces[surface];
  const style: CSSProperties = {
    backgroundColor: surfaceStyle.backgroundColor,
    border: `${surfaceStyle.borderWidth} solid ${surfaceStyle.borderColor}`,
    borderRadius: surfaceStyle.borderRadius,
    padding,
  };
  const surfaceClassName = ["surface", surface === "subtle" ? "surface--subtle" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={surfaceClassName} style={style}>
      {children}
    </Component>
  );
}
