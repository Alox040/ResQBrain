"use client";

import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

type ButtonSecondaryProps = {
  children: ReactNode;
  href?: string;
  external?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
};

const baseClassName =
  "inline-flex items-center justify-center rounded-full border border-[var(--color-accent)] bg-transparent px-6 py-3 text-sm font-semibold text-[var(--color-accent)] transition-colors hover:bg-[rgba(0,201,212,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]";

export function ButtonSecondary({
  children,
  href,
  external,
  onClick,
}: ButtonSecondaryProps) {
  if (href && external) {
    return (
      <a
        href={href}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
        className={baseClassName}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

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
