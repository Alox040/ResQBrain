import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { colors, radius, spacing, typography } from "../theme/tokens";

type SearchBarProps = {
  placeholder?: string;
};

export function SearchBar({ placeholder = "Search" }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.icon} />
      <TextInput
        editable={false}
        placeholder={placeholder}
        placeholderTextColor={colors.text.subtle}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.background.surfaceElevated,
    borderColor: colors.border.default,
    borderRadius: radius.xl,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing[3],
    minHeight: 56,
    paddingHorizontal: spacing[4],
  },
  icon: {
    backgroundColor: colors.border.strong,
    borderRadius: radius.full,
    height: 14,
    width: 14,
  },
  input: {
    color: colors.text.primary,
    flex: 1,
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.base,
    paddingVertical: spacing[3],
  },
});
