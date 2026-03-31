export type AppPalette = {
  bg: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryMutedBg: string;
  link: string;
  /** Warn-/Dosierungs-Karten */
  warningBg: string;
  warningBgProminent: string;
  warningBorder: string;
  warningBorderStrong: string;
  warningIcon: string;
  warningTitle: string;
  warningBody: string;
  /** Medikament: Dosier-Panel um WarningCard */
  dosagePanelBg: string;
  dosagePanelBorder: string;
  /** Algorithmus-Schritte */
  stepCardBg: string;
  stepCardBorder: string;
  navHeaderBg: string;
  navHeaderText: string;
  tabBarBg: string;
  tabActive: string;
  tabInactive: string;
  pressedRowBg: string;
  pressedRowBorder: string;
};

export const lightPalette: AppPalette = {
  bg: '#f3f4f6',
  surface: '#ffffff',
  surfaceMuted: '#fafafa',
  border: '#e5e7eb',
  text: '#111827',
  textMuted: '#6b7280',
  primary: '#2563eb',
  primaryMutedBg: '#eff6ff',
  link: '#2563eb',
  warningBg: '#fffbeb',
  warningBgProminent: '#fef3c7',
  warningBorder: '#f59e0b',
  warningBorderStrong: '#d97706',
  warningIcon: '#b45309',
  warningTitle: '#b45309',
  warningBody: '#78350f',
  dosagePanelBg: '#f8fafc',
  dosagePanelBorder: '#93c5fd',
  stepCardBg: '#f8fafc',
  stepCardBorder: '#e2e8f0',
  navHeaderBg: '#111827',
  navHeaderText: '#f9fafb',
  tabBarBg: '#111827',
  tabActive: '#60a5fa',
  tabInactive: '#9ca3af',
  pressedRowBg: '#eff6ff',
  pressedRowBorder: '#bfdbfe',
};

export const darkPalette: AppPalette = {
  bg: '#0f172a',
  surface: '#1e293b',
  surfaceMuted: '#334155',
  border: '#334155',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  primary: '#60a5fa',
  primaryMutedBg: '#1e3a5f',
  link: '#93c5fa',
  warningBg: '#422006',
  warningBgProminent: '#713f12',
  warningBorder: '#f59e0b',
  warningBorderStrong: '#fbbf24',
  warningIcon: '#fbbf24',
  warningTitle: '#fde68a',
  warningBody: '#fef3c7',
  dosagePanelBg: '#172554',
  dosagePanelBorder: '#3b82f6',
  stepCardBg: '#1e293b',
  stepCardBorder: '#475569',
  navHeaderBg: '#020617',
  navHeaderText: '#f8fafc',
  tabBarBg: '#020617',
  tabActive: '#60a5fa',
  tabInactive: '#64748b',
  pressedRowBg: '#1e3a5f',
  pressedRowBorder: '#3b82f6',
};
