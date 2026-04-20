import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { colors } from "@/ui/theme/colors";
import { radii } from "@/ui/theme/radii";
import { spacing } from "@/ui/theme/spacing";

export type CardProps = {
  children: ReactNode;
  onPress?: () => void;
};

export function Card({ children, onPress }: CardProps) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.base, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={styles.base}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.card,
    padding: spacing.cardPadding,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  pressed: {
    opacity: 0.92,
    borderColor: colors.borderSubtle,
  },
});
