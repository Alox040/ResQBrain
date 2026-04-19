import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./styles/**/*.{css}",
  ],
  theme: {
    extend: {
      colors: {
        base: "rgb(var(--color-base) / <alpha-value>)",
        "surface-subtle": "rgb(var(--color-surface-subtle) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-strong": "rgb(var(--color-surface-strong) / <alpha-value>)",
        "border-subtle": "rgb(var(--color-border-subtle) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        "border-muted": "rgb(var(--color-border-muted) / <alpha-value>)",
        "text-primary": "rgb(var(--color-text-primary) / <alpha-value>)",
        "text-secondary": "rgb(var(--color-text-secondary) / <alpha-value>)",
        "text-body": "rgb(var(--color-text-body) / <alpha-value>)",
        "text-muted": "rgb(var(--color-text-muted) / <alpha-value>)",
        "text-faint": "rgb(var(--color-text-faint) / <alpha-value>)",
        positive: "rgb(var(--color-accent-positive) / <alpha-value>)",
        "positive-bg": "rgb(var(--color-accent-positive-bg) / <alpha-value>)",
        warning: "rgb(var(--color-accent-warning) / <alpha-value>)",
        alert: "rgb(var(--color-accent-alert) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Segoe UI", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "42rem",
        content: "64rem",
        layout: "80rem",
      },
      spacing: {
        section: "clamp(6rem, 10vw, 8rem)",
        "section-sm": "clamp(4.5rem, 7vw, 6rem)",
        gutter: "clamp(1rem, 3vw, 2rem)",
        card: "1.5rem",
        "card-wide": "clamp(1.5rem, 3vw, 2.5rem)",
      },
      borderRadius: {
        sm: "0.375rem",
        md: "0.625rem",
        lg: "1rem",
        xl: "1.5rem",
      },
      boxShadow: {
        panel: "0 24px 64px rgba(0, 0, 0, 0.28)",
        inset: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
      },
      letterSpacing: {
        display: "-0.045em",
        heading: "-0.025em",
      },
      backgroundImage: {
        "site-grid":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "site-radial":
          "radial-gradient(circle at top, rgba(16,185,129,0.12), transparent 38%), radial-gradient(circle at 80% 20%, rgba(245,158,11,0.1), transparent 28%)",
      },
    },
  },
};

export default config;
