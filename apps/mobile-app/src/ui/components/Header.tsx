import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/ui/theme/colors";
import { radii } from "@/ui/theme/radii";
import { spacing } from "@/ui/theme/spacing";
import { fontSize, fontWeight, letterSpacing } from "@/ui/theme/typography";

export type HeaderProps = {
  title: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
};

export function Header({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {leftIcon ? (
          <Pressable
            onPress={onLeftPress}
            disabled={!onLeftPress}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
          >
            {leftIcon}
          </Pressable>
        ) : (
          <View style={styles.iconSpacer} />
        )}
      </View>

      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>

      <View style={[styles.side, styles.sideRight]}>
        {rightIcon ? (
          <Pressable
            onPress={onRightPress}
            disabled={!onRightPress}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
          >
            {rightIcon}
          </Pressable>
        ) : (
          <View style={styles.iconSpacer} />
        )}
      </View>
    </View>
  );
}

const iconSize = spacing.iconContainerSm;

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.itemGap,
  },
  side: {
    width: iconSize,
    alignItems: "flex-start",
  },
  sideRight: {
    alignItems: "flex-end",
  },
  iconButton: {
    width: iconSize,
    height: iconSize,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonPressed: {
    opacity: 0.92,
  },
  iconSpacer: {
    width: iconSize,
    height: iconSize,
  },
  title: {
    flex: 1,
    textAlign: "center",
    color: colors.textStrong,
    fontSize: fontSize.h2,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tight * fontSize.h2,
  },
});
