import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

const baseClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold leading-normal transition-colors duration-150 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const variants = {
  primary: "border-transparent bg-primary text-on-primary hover:bg-primary-hover",
  outline: "border-border bg-surface text-foreground hover:bg-surface-muted",
  secondary: "border-border bg-surface-muted text-foreground hover:bg-surface-muted/90",
} as const;

export type ButtonVariant = keyof typeof variants;

type ButtonOwnProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
};

type ButtonAsAnchor = ButtonOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

type ButtonAsButton = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

export type ButtonProps = ButtonAsAnchor | ButtonAsButton;

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  const cls = cn(baseClass, variants[variant], className);

  if ("href" in props && props.href !== undefined) {
    const { href, ...rest } = props;
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    );
  }

  const { type = "button", ...rest } = props as ButtonAsButton;
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}
