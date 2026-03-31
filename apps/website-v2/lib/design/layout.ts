import { spacing } from "@/lib/design/spacing";

export const layout = {
  width: {
    narrow: "40rem",
    content: "72rem",
    wide: "84rem",
  },
  container: {
    paddingInline: spacing.inset.default,
    paddingInlineMobile: spacing.inset.compact,
  },
  header: {
    minHeight: "4.5rem",
  },
  section: {
    gap: spacing.stack.relaxed,
    paddingBlock: spacing.section.default,
    paddingBlockCompact: spacing.section.compact,
  },
  card: {
    gap: spacing.stack.default,
    padding: spacing.inset.default,
    paddingCompact: spacing.inset.compact,
  },
  prose: {
    maxWidth: "44rem",
  },
} as const;

export type Layout = typeof layout;
