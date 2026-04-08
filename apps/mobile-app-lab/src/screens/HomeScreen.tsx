import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { SearchBar } from "../components/SearchBar";
import { colors, radius, spacing, typography } from "../theme/tokens";

export function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Dashboard</Text>
          <Text style={styles.title}>Home</Text>
          <Text style={styles.subtitle}>Quick access, recent activity, and learning progress.</Text>
        </View>

        <SearchBar placeholder="Search protocols, drugs, and notes" />

        <View style={styles.contentArea}>
          <View style={styles.heroCard}>
            <View style={styles.heroBadge} />
            <View style={styles.heroLineLong} />
            <View style={styles.heroLineShort} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.row}>
              <View style={styles.actionCard} />
              <View style={styles.actionCard} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Items</Text>
            <View style={styles.listCard} />
            <View style={styles.listCard} />
            <View style={styles.listCard} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background.app,
    flex: 1,
  },
  content: {
    gap: spacing[5],
    padding: spacing.screenPadding,
    paddingTop: spacing[6],
  },
  header: {
    gap: spacing[2],
  },
  eyebrow: {
    color: colors.brand.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.widest,
    textTransform: "uppercase",
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight["3xl"],
  },
  subtitle: {
    color: colors.text.muted,
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.base,
  },
  contentArea: {
    gap: spacing[6],
    paddingBottom: spacing[8],
  },
  heroCard: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radius["3xl"],
    borderWidth: 1,
    gap: spacing[4],
    padding: spacing.cardPaddingLg,
  },
  heroBadge: {
    backgroundColor: colors.brand.primarySoft,
    borderRadius: radius.full,
    height: 36,
    width: 72,
  },
  heroLineLong: {
    backgroundColor: colors.background.surfaceTint,
    borderRadius: radius.sm,
    height: 18,
    width: "82%",
  },
  heroLineShort: {
    backgroundColor: colors.background.surfaceTint,
    borderRadius: radius.sm,
    height: 14,
    width: "58%",
  },
  section: {
    gap: spacing[3],
  },
  sectionTitle: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    gap: spacing[3],
  },
  actionCard: {
    backgroundColor: colors.background.surfaceElevated,
    borderColor: colors.border.default,
    borderRadius: radius.xl,
    borderWidth: 1,
    flex: 1,
    height: 112,
  },
  listCard: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radius.xl,
    borderWidth: 1,
    height: 88,
  },
});
