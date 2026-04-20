import type { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "@/ui/theme/colors";
import { spacing } from "@/ui/theme/spacing";

export type DetailLayoutProps = {
  header: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  contentPaddingBottom?: number;
};

export function DetailLayout({
  header,
  children,
  footer,
  contentPaddingBottom = spacing.detailPaddingBottom,
}: DetailLayoutProps) {
  return (
    <SafeAreaView edges={["top", "left", "right", "bottom"]} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>{header}</View>
        <ScrollView
          contentContainerStyle={[
            styles.contentContainer,
            { paddingBottom: contentPaddingBottom },
          ]}
          showsVerticalScrollIndicator={false}
          style={styles.content}
        >
          {children}
        </ScrollView>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.base,
  },
  container: {
    flex: 1,
    backgroundColor: colors.base,
  },
  header: {
    paddingHorizontal: spacing.screenPaddingH,
    paddingTop: spacing.itemGap,
    paddingBottom: spacing.itemGap,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDeep,
    backgroundColor: colors.base,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.screenPaddingH,
    paddingTop: spacing.sectionGap,
    gap: spacing.sectionGap,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.screenPaddingH,
    paddingTop: spacing.itemGap,
    paddingBottom: spacing.screenPaddingH,
    backgroundColor: colors.base,
    borderTopWidth: 1,
    borderTopColor: colors.borderDeep,
  },
});
