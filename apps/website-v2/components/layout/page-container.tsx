import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";

type PageContainerProps = {
  children: ReactNode;
};

export function PageContainer({ children }: PageContainerProps) {
  return <Container className="py-10 sm:py-14">{children}</Container>;
}
