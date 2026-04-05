import type { ReactNode } from "react";

type CardTitleProps = {
  children: ReactNode;
};

export function CardTitle({ children }: CardTitleProps) {
  return <h3 className="card-heading">{children}</h3>;
}
