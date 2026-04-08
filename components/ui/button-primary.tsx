"use client";

import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

type ButtonPrimaryProps = {
  children: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
};

const baseClassName =
  "inline-flex items-center justify-center rounded-full border border-transparent bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-[#33d6df] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]";

export function ButtonPrimary({
  children,
  href,
  onClick,
}: ButtonPrimaryProps) {
  if (href) {
    return (
      <Link href={href} onClick={onClick} className={baseClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClassName}>
      {children}
    </button>
  );
}
