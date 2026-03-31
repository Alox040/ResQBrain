import type { PropsWithChildren } from "react";

export function ContentCard({ children }: PropsWithChildren) {
  return <div className="surface content-card">{children}</div>;
}
