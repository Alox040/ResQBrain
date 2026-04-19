export const tokens = {
  color: {
    base: "zinc-950",
    surface: {
      subtle: "zinc-900/20",
      default: "zinc-900/30",
      strong: "zinc-900/50",
    },
    border: {
      subtle: "zinc-800/60",
      default: "zinc-800",
      muted: "zinc-900",
    },
    text: {
      primary: "zinc-50",
      secondary: "zinc-300",
      body: "zinc-400",
      muted: "zinc-500",
      faint: "zinc-600",
    },
    accent: {
      positive: "emerald-500",
      positiveBg: "emerald-600",
      warning: "amber-500",
      alert: "orange-500",
    },
  },
  spacing: {
    section: "py-24 sm:py-32",
    sectionCompact: "py-18 sm:py-24",
    contentPadding: "px-4 sm:px-6 lg:px-8",
    card: "p-6",
    cardWide: "p-6 sm:p-10",
    stackSm: "gap-3",
    stackMd: "gap-4",
    stackLg: "gap-6",
  },
  typography: {
    eyebrow:
      "text-[0.72rem] font-medium uppercase tracking-[0.18em] text-zinc-500",
    display:
      "text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.045em] text-zinc-50 sm:text-6xl lg:text-7xl",
    h1: "text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-zinc-50 sm:text-5xl",
    h2: "text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-zinc-50 sm:text-4xl",
    h3: "text-xl font-semibold leading-[1.15] tracking-[-0.02em] text-zinc-100 sm:text-2xl",
    body: "text-base leading-7 text-zinc-400",
    bodyLarge: "text-lg leading-8 text-zinc-300",
    bodySmall: "text-sm leading-6 text-zinc-500",
    muted: "text-sm leading-6 text-zinc-500",
    link: "text-sm font-medium text-zinc-200 underline decoration-zinc-700 underline-offset-4 transition hover:text-zinc-50 hover:decoration-zinc-400",
  },
  maxWidth: {
    prose: "max-w-2xl",
    content: "max-w-4xl",
    layout: "max-w-6xl",
  },
  radius: {
    sm: "rounded",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  },
  grid: {
    single: "",
    twoCol: "grid gap-6 sm:grid-cols-2",
    twoColWide: "grid gap-8 md:grid-cols-2",
    fourCol: "grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4",
    twelveCol: "grid gap-8 md:grid-cols-12",
  },
  primitive: {
    container: "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8",
    pageContainer: "mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8",
    section: "border-b border-zinc-900/50 py-24 sm:py-32",
    text: {
      body: "text-base leading-7 text-zinc-400",
      lead: "text-lg leading-8 text-zinc-300",
      muted: "text-sm leading-6 text-zinc-500",
    },
    heading: {
      hero: "text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.045em] text-zinc-50 sm:text-6xl lg:text-7xl",
      section: "text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-zinc-50 sm:text-4xl",
      card: "text-xl font-semibold leading-[1.15] tracking-[-0.02em] text-zinc-100",
    },
  },
} as const;

export const containerClassName = tokens.primitive.container;
export const sectionClassName = tokens.primitive.section;
export const textClassNames = tokens.primitive.text;
export const headingClassNames = tokens.primitive.heading;
