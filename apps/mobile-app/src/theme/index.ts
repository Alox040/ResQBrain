import type { AppPalette } from '@/theme/palette';
import { lightPalette } from '@/theme/palette';

export * from '@/theme/palette';
export * from '@/theme/ThemeContext';

/** @deprecated Prefer `useTheme().colors` for Dark Mode. */
export const COLORS: AppPalette = lightPalette;

export const SPACING = {
  screenPadding: 16,
  screenPaddingBottom: 24,
  gapXs: 4,
  gapSm: 8,
  gapMd: 12,
  detailBlockGap: 22,
  sectionStackGap: 20,
  radius: 16,
  radiusSm: 12,
} as const;

/** Einsatz: große Antippflächen (min. Höhe 56) */
export const LAYOUT = {
  minTap: 56,
  listRowMinHeight: 56,
  searchHitMinHeight: 56,
} as const;

/** Titel 20 / Inhalt 16 — Farben über `useTheme().colors` */
export const TYPOGRAPHY = {
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 28,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700' as const,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
  },
  body: { fontSize: 16, lineHeight: 24 },
  bodyMuted: { fontSize: 16, lineHeight: 22 },
} as const;

/** Rahmen ohne Farben — mit `colors.surface` / `colors.border` kombinieren */
export const CARD = {
  shell: {
    borderRadius: SPACING.radius,
    padding: SPACING.screenPadding,
    borderWidth: 1,
  },
  /** @deprecated Nutze shell + theme colors */
  base: {
    borderRadius: SPACING.radius,
    padding: SPACING.screenPadding,
    backgroundColor: lightPalette.surface,
    borderWidth: 1,
    borderColor: lightPalette.border,
  },
} as const;
