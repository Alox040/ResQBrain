import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  size?: "default" | "lg";
  external?: boolean;
};

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary",
  size = "default",
  external = false,
}: ButtonLinkProps) {
  const buttonClassName = [
    "button-link",
    variant === "secondary" ? "button-link--secondary" : "",
    size === "lg" ? "button-link--lg" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (external) {
    return (
      <a className={buttonClassName} href={href} rel="noreferrer" target="_blank">
        {children}
      </a>
    );
  }

  return (
    <Link className={buttonClassName} href={href}>
      {children}
    </Link>
  );
}
