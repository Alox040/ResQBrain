import Link from "next/link";
import type { ReactNode } from "react";

type TextLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
};

export function TextLink({ href, children, className, external = false }: TextLinkProps) {
  const linkClassName = ["text-link", className].filter(Boolean).join(" ");

  if (external) {
    return (
      <a className={linkClassName} href={href} rel="noreferrer" target="_blank">
        {children}
      </a>
    );
  }

  return (
    <Link className={linkClassName} href={href}>
      {children}
    </Link>
  );
}
