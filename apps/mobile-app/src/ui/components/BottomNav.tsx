import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/ui/theme/colors";
import { radii } from "@/ui/theme/radii";
import { spacing } from "@/ui/theme/spacing";
import { fontSize, fontWeight, letterSpacing } from "@/ui/theme/typography";

export type BottomNavItem = {
  label: string;
  icon?: ReactNode;
};

export type BottomNavProps = {
  items: BottomNavItem[];
  activeIndex: number;
  onTabPress: (index: number) => void;
};

export function BottomNav({ items, activeIndex, onTabPress }: BottomNavProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {items.map((item, index) => {
          const active = index === activeIndex;
          return (
            <Pressable
              key={`${item.label}-${index}`}
              onPress={() => onTabPress(index)}
              style={({ pressed }) => [
                styles.item,
                active && styles.itemActive,
                pressed && styles.itemPressed,
              ]}
            >
              {item.icon ? <View style={styles.iconSlot}>{item.icon}</View> : null}
              <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: spacing.bottomNavMarginH,
    right: spacing.bottomNavMarginH,
    bottom: spacing.bottomNavBottom,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.bottomNavPaddingH,
    paddingVertical: spacing.bottomNavPaddingV,
    borderRadius: radii.full,
    backgroundColor: colors.surfaceDeep,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  item: {
    flex: 1,
    minHeight: spacing.bottomNavItemHeight,
    marginHorizontal: spacing.bottomNavItemMarginH,
    borderRadius: radii.full,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  itemActive: {
    backgroundColor: colors.sky.subtle,
  },
  itemPressed: {
    opacity: 0.92,
  },
  iconSlot: {
    minHeight: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSize.navLabel,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.wide * fontSize.navLabel,
    textTransform: "uppercase",
  },
  labelActive: {
    color: colors.sky.text,
  },
});
