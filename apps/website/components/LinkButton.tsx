import Link from "next/link";

import styles from "./LinkButton.module.css";

export type LinkButtonProps = {
  title: string;
  href: string;
};

function useNativeAnchor(href: string) {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

export function LinkButton({ title, href }: LinkButtonProps) {
  const className = styles.root;

  if (useNativeAnchor(href)) {
    return (
      <a
        className={className}
        href={href}
        rel="noopener noreferrer"
        target={href.startsWith("http") ? "_blank" : undefined}
      >
        {title}
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {title}
    </Link>
  );
}
