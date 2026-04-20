import { StyleSheet, Text, TextInput, View } from "react-native";

import { colors } from "@/ui/theme/colors";
import { radii } from "@/ui/theme/radii";
import { spacing } from "@/ui/theme/spacing";
import { fontSize, fontWeight } from "@/ui/theme/typography";

export type SearchBarProps = {
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
};

export function SearchBar({
  value,
  placeholder = "Suchen",
  onChangeText,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.leadingIcon}>{"O"}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        selectionColor={colors.sky.solid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    borderRadius: radii.listItem,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.listItemPadding,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.badgeToText,
  },
  leadingIcon: {
    color: colors.textMuted,
    fontSize: fontSize.bodyMd,
  },
  input: {
    flex: 1,
    color: colors.textStrong,
    fontSize: fontSize.bodyMd,
    fontWeight: fontWeight.medium,
    paddingVertical: 0,
  },
});
