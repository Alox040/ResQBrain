import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { CARD, COLORS, TYPOGRAPHY } from '@/theme';

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
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <View style={[CARD.base, styles.panel, style]}>
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
          color={COLORS.textMuted}
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
  return (
    <AccordionPanel title={title} defaultExpanded={defaultExpanded} style={style}>
      <Text style={styles.bodyText}>{body}</Text>
    </AccordionPanel>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    ...TYPOGRAPHY.body,
    flex: 1,
    fontWeight: '600',
  },
  body: {
    marginTop: 8,
  },
  bodyText: {
    ...TYPOGRAPHY.bodyMuted,
    lineHeight: 22,
  },
});
