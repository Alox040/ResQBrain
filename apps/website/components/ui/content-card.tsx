import type { PropsWithChildren } from "react";

export function ContentCard({ children }: PropsWithChildren) {
  return <div className="card">{children}</div>;
}
