"use client";

import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactElement,
  ReactNode,
} from "react";
import { cloneElement, isValidElement } from "react";

type ButtonVariant = "primary" | "ghost" | "accent" | "link";
type ButtonSize = "sm" | "md" | "lg";

type BaseButtonProps = {
  variant: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  rightIcon?: ReactNode;
  className?: string;
  children: ReactNode;
};

type NativeButtonProps = BaseButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type LinkButtonProps = BaseButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ButtonProps = NativeButtonProps | LinkButtonProps;

function joinClasses(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function getVariantClassName(variant: ButtonVariant): string {
  switch (variant) {
    case "primary":
      return "border-emerald-500 bg-emerald-500 text-zinc-950 hover:border-emerald-400 hover:bg-emerald-400";
    case "ghost":
      return "border-zinc-800 bg-transparent text-zinc-200 hover:border-zinc-700 hover:bg-zinc-900/60";
    case "accent":
      return "border-amber-500 bg-amber-500 text-zinc-950 hover:border-amber-400 hover:bg-amber-400";
    case "link":
      return "border-transparent bg-transparent px-0 text-zinc-100 hover:text-zinc-50";
  }
}

function getSizeClassName(size: ButtonSize): string {
  switch (size) {
    case "sm":
      return "h-10 px-4 text-sm";
    case "md":
      return "h-11 px-5 text-sm";
    case "lg":
      return "h-12 px-6 text-base";
  }
}

function ButtonInner({
  children,
  rightIcon,
}: {
  children: ReactNode;
  rightIcon?: ReactNode;
}) {
  return (
    <>
      <span>{children}</span>
      {rightIcon ? <span aria-hidden="true">{rightIcon}</span> : null}
    </>
  );
}

export function Button(props: ButtonProps) {
  const {
    variant,
    size = "md",
    asChild = false,
    rightIcon,
    className,
    children,
    ...rest
  } = props;

  const classNames = joinClasses(
    "inline-flex items-center justify-center gap-2 rounded-full border font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-50",
    getVariantClassName(variant),
    getSizeClassName(size),
    className,
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string; children?: ReactNode }>;
    return cloneElement(child, {
      className: joinClasses(classNames, child.props.className),
      children: <ButtonInner rightIcon={rightIcon}>{child.props.children}</ButtonInner>,
    });
  }

  if ("href" in rest && typeof rest.href === "string") {
    const { href, target, rel, ...linkProps } = rest;
    const isExternal = target === "_blank";
    return (
      <Link
        href={href}
        className={classNames}
        target={target}
        rel={isExternal ? rel ?? "noopener noreferrer" : rel}
        {...linkProps}
      >
        <ButtonInner rightIcon={rightIcon}>{children}</ButtonInner>
      </Link>
    );
  }

  return (
    <button className={classNames} type="button" {...rest}>
      <ButtonInner rightIcon={rightIcon}>{children}</ButtonInner>
    </button>
  );
}
