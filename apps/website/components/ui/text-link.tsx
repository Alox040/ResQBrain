import Link from "next/link";
import type { ReactNode } from "react";

type TextLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function TextLink({ href, children, className }: TextLinkProps) {
  return (
    <Link className={["text-link", className].filter(Boolean).join(" ")} href={href}>
      {children}
    </Link>
  );
}
