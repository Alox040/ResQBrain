import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { COLORS, SPACING } from '@/theme';

export type ScreenHeaderProps = {
  title?: string;
  /** Show back control when true and onBackPress provided */
  showBackButton?: boolean;
  onBackPress?: () => void;
  backIcon?: React.ReactNode;
  titleVariant?: 'default' | 'large';
  rightAccessory?: React.ReactNode;
  onRightPress?: () => void;
  style?: ViewStyle;
};

export function ScreenHeader({
  title,
  showBackButton = false,
  onBackPress,
  backIcon,
  titleVariant = 'default',
  rightAccessory,
  onRightPress,
  style,
}: ScreenHeaderProps) {
  const canBack = Boolean(showBackButton && onBackPress);

  return (
    <View style={[styles.row, style]}>
      <View style={styles.leftCluster}>
        {canBack ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Zurück"
            hitSlop={12}
            onPress={onBackPress}
            activeOpacity={0.8}
          >
            {backIcon ?? (
              <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            )}
          </TouchableOpacity>
        ) : null}
        {title ? (
          <Text
            style={titleVariant === 'large' ? styles.titleLarge : styles.title}
            numberOfLines={2}
          >
            {title}
          </Text>
        ) : null}
      </View>
      {rightAccessory ? (
        <TouchableOpacity
          disabled={!onRightPress}
          onPress={onRightPress}
          activeOpacity={onRightPress ? 0.8 : 1}
          hitSlop={8}
        >
          {rightAccessory}
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.gapMd,
    marginBottom: SPACING.gapSm,
  },
  leftCluster: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.gapMd,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  titleLarge: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
});
