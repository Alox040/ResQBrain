"use client";

import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

type ButtonTextProps = {
  children: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
};

const baseClassName =
  "inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)] transition-colors hover:text-[#33d6df] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]";

function ButtonTextContent({ children }: { children: ReactNode }) {
  return (
    <>
      <span>{children}</span>
      <span aria-hidden="true">→</span>
    </>
  );
}

export function ButtonText({ children, href, onClick }: ButtonTextProps) {
  if (href) {
    return (
      <Link href={href} onClick={onClick} className={baseClassName}>
        <ButtonTextContent>{children}</ButtonTextContent>
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClassName}>
      <ButtonTextContent>{children}</ButtonTextContent>
    </button>
  );
}
