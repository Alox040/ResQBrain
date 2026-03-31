import type { ReactNode } from "react";

import { Surface } from "@/components/ui/surface";
import { layout } from "@/lib/design";

type ContentCardProps = {
  children: ReactNode;
  className?: string;
};

export function ContentCard({ children, className }: ContentCardProps) {
  return (
    <Surface
      as="article"
      className={className}
      padding={layout.card.padding}
      surface="base"
    >
      {children}
    </Surface>
  );
}
