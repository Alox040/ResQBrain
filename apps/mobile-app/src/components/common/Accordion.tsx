import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { CARD, SPACING, TYPOGRAPHY } from '@/theme';
import type { AppPalette } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeContext';

export type AccordionPanelProps = {
  title: string;
  /** Rich content below the title when expanded */
  children: React.ReactNode;
  defaultExpanded?: boolean;
  style?: ViewStyle;
};

export function AccordionPanel({
  title,
  children,
  defaultExpanded = false,
  style,
}: AccordionPanelProps) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.panel, style]}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={title}
        activeOpacity={0.8}
        onPress={() => setExpanded((v) => !v)}
        style={styles.headerRow}
      >
        <Text style={styles.title} numberOfLines={3}>
          {title}
        </Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.textMuted}
        />
      </TouchableOpacity>
      {expanded ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

/** Simple text body; for rich content use {@link AccordionPanel} with `children`. */
export function AccordionTextPanel({
  title,
  body,
  defaultExpanded = false,
  style,
}: {
  title: string;
  body: string;
  defaultExpanded?: boolean;
  style?: ViewStyle;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <AccordionPanel title={title} defaultExpanded={defaultExpanded} style={style}>
      <Text style={styles.bodyText}>{body}</Text>
    </AccordionPanel>
  );
}

function createStyles(colors: AppPalette) {
  return StyleSheet.create({
    panel: {
      ...CARD.shell,
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: SPACING.gapMd,
    },
    title: {
      ...TYPOGRAPHY.body,
      flex: 1,
      fontWeight: '600',
      color: colors.text,
    },
    body: {
      marginTop: SPACING.gapSm,
    },
    bodyText: {
      ...TYPOGRAPHY.bodyMuted,
      lineHeight: 22,
      color: colors.textMuted,
    },
  });
}
