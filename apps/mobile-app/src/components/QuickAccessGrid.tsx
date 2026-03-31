import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ContentKind } from '@/types/content';
import { LAYOUT, SPACING } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

export type QuickAccessGridItem = {
  reactKey: string;
  kind: ContentKind;
  label: string;
  onPress: () => void;
  source: 'favorite' | 'recent';
};

export type QuickAccessGridProps = {
  items: QuickAccessGridItem[];
};

function chunkPairs<T>(items: T[]): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }
  return rows;
}

function typeLabelDe(kind: ContentKind): string {
  return kind === 'medication' ? 'Medikament' : 'Algorithmus';
}

function medAlgoTone(
  kind: ContentKind,
  colors: AppPalette,
  isDark: boolean,
): { border: string; iconBg: string; iconColor: string } {
  if (kind === 'medication') {
    return isDark
      ? {
          border: '#3b82f6',
          iconBg: colors.primaryMutedBg,
          iconColor: colors.primary,
        }
      : {
          border: '#93c5fd',
          iconBg: '#dbeafe',
          iconColor: '#1e40af',
        };
  }
  return isDark
    ? {
        border: '#a78bfa',
        iconBg: '#2e1064',
        iconColor: '#c4b5fd',
      }
    : {
        border: '#c4b5fd',
        iconBg: '#ede9fe',
        iconColor: '#5b21b6',
      };
}

function QuickAccessCell({ item }: { item: QuickAccessGridItem }) {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const tone = useMemo(
    () => medAlgoTone(item.kind, colors, isDark),
    [item.kind, colors, isDark],
  );

  const t = typeLabelDe(item.kind);
  const cornerIcon = item.source === 'favorite' ? 'star' : 'time-outline';
  const cornerColor = item.source === 'favorite' ? '#ca8a04' : colors.textMuted;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.label}. ${t}. Schnellzugriff — Detail öffnen.`}
      onPress={item.onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.cell,
        { borderColor: tone.border },
        pressed ? styles.cellPressed : null,
      ]}
    >
      <View style={styles.cellHeader}>
        <View style={[styles.iconWrap, { backgroundColor: tone.iconBg }]}>
          <Ionicons
            name={item.kind === 'medication' ? 'medkit' : 'git-branch'}
            size={28}
            color={tone.iconColor}
          />
        </View>
        <Ionicons name={cornerIcon} size={18} color={cornerColor} />
      </View>
      <Text style={styles.kindHint} numberOfLines={1}>
        {t}
      </Text>
      <Text style={styles.title} numberOfLines={2}>
        {item.label}
      </Text>
    </Pressable>
  );
}

/**
 * 2-column grid of large, touch-friendly shortcuts (max 4 items expected).
 */
export function QuickAccessGrid({ items }: QuickAccessGridProps) {
  const rows = useMemo(() => chunkPairs(items), [items]);

  return (
    <View style={stylesGrid.grid} accessibilityRole="list">
      {rows.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={stylesGrid.row}>
          {row.map((item) => (
            <View key={item.reactKey} style={stylesGrid.cellSlot}>
              <QuickAccessCell item={item} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const stylesGrid = StyleSheet.create({
  grid: {
    gap: SPACING.gapMd,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.gapMd,
  },
  cellSlot: {
    flex: 1,
    minWidth: 0,
  },
});

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    cell: {
      minHeight: Math.max(112, LAYOUT.minTap * 2),
      padding: SPACING.gapMd + 4,
      borderRadius: SPACING.radius,
      backgroundColor: colors.surface,
      borderWidth: 2,
      justifyContent: 'space-between',
      gap: SPACING.gapXs,
    },
    cellPressed: {
      backgroundColor: colors.pressedRowBg,
    },
    cellHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    iconWrap: {
      width: 52,
      height: 52,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    kindHint: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.3,
      color: colors.textMuted,
      textTransform: 'uppercase',
    },
    title: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.text,
      lineHeight: 26,
      letterSpacing: -0.3,
    },
  });
}
