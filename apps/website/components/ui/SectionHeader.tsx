import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
};

export function SectionHeader({ title, description, className }: SectionHeaderProps) {
  return (
    <header className={cn("mb-6 max-w-xl space-y-4 md:mb-8 md:space-y-6", className)}>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-[clamp(1.65rem,2.5vw,2rem)]">
        {title}
      </h2>
      {description ? (
        <p className="text-base leading-relaxed text-muted md:text-[1.05rem] md:leading-[1.55]">
          {description}
        </p>
      ) : null}
    </header>
  );
}
