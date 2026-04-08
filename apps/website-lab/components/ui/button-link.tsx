import Link from "next/link";
import type { PropsWithChildren } from "react";

type ButtonLinkProps = PropsWithChildren<{
  href: string;
  variant?: "primary" | "secondary" | "quiet";
  external?: boolean;
}>;

export function ButtonLink({
  children,
  href,
  variant = "primary",
  external = false,
}: ButtonLinkProps) {
  return (
    <Link
      className={`button-link button-link--${variant}`}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      <span>{children}</span>
    </Link>
  );
}
