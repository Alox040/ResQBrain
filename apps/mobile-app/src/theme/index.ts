export const COLORS = {
  bg: '#f3f4f6',
  surface: '#ffffff',
  border: '#e5e7eb',
  text: '#111827',
  textMuted: '#6b7280',
  primary: '#2563eb',
  primaryMutedBg: '#eff6ff',
} as const;

export const SPACING = {
  screenPadding: 16,
  screenPaddingBottom: 24,
  /** Kleinstes vertikales/horizontales Raster — z. B. Titel↔Untertitel */
  gapXs: 4,
  gapSm: 8,
  gapMd: 12,
  /** Vertikaler Abstand zwischen kritischen Detail-Screen-Blöcken */
  detailBlockGap: 22,
  /** Abstand zwischen größeren Screen-Sektionen (Listen, Kurzwege) */
  sectionStackGap: 20,
  radius: 16,
  radiusSm: 12,
} as const;

/** Notfall-orientierte Mindestmaße — WCAG-nahe Antippflächen, lesbare Zeilen */
export const LAYOUT = {
  minTap: 48,
  listRowMinHeight: 104,
  searchHitMinHeight: 100,
} as const;

export const TYPOGRAPHY = {
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text } as const,
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: COLORS.primary,
  } as const,
  body: { fontSize: 16, lineHeight: 24, color: COLORS.text } as const,
  bodyMuted: { fontSize: 15, lineHeight: 22, color: COLORS.textMuted } as const,
} as const;

export const CARD = {
  base: {
    borderRadius: SPACING.radius,
    padding: SPACING.screenPadding,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  } as const,
} as const;
