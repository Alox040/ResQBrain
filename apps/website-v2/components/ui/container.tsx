import type { CSSProperties, ReactNode } from "react";

import { layout } from "@/lib/design";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  maxWidth?: keyof typeof layout.width;
};

export function Container({ children, className, maxWidth = "content" }: ContainerProps) {
  const style: CSSProperties = {
    marginInline: "auto",
    maxWidth: layout.width[maxWidth],
    paddingInline: layout.container.paddingInlineMobile,
    width: "100%",
  };

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
