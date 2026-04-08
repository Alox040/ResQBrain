import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { SearchBar } from "../components/SearchBar";
import { colors, radius, spacing, typography } from "../theme/tokens";

export function SearchScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Lookup</Text>
          <Text style={styles.title}>Search</Text>
          <Text style={styles.subtitle}>A neutral search layout for results, filters, and categories.</Text>
        </View>

        <SearchBar placeholder="Search everything" />

        <View style={styles.contentArea}>
          <View style={styles.filterRow}>
            <View style={styles.filterChip} />
            <View style={styles.filterChip} />
            <View style={styles.filterChipWide} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Results</Text>
            <View style={styles.resultCard} />
            <View style={styles.resultCard} />
            <View style={styles.resultCard} />
            <View style={styles.resultCard} />
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
    color: colors.brand.info,
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
  filterRow: {
    flexDirection: "row",
    gap: spacing[2],
  },
  filterChip: {
    backgroundColor: colors.background.surfaceElevated,
    borderColor: colors.border.default,
    borderRadius: radius.full,
    borderWidth: 1,
    height: 40,
    width: 84,
  },
  filterChipWide: {
    backgroundColor: colors.background.surfaceElevated,
    borderColor: colors.border.default,
    borderRadius: radius.full,
    borderWidth: 1,
    height: 40,
    width: 112,
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
  resultCard: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radius.xl,
    borderWidth: 1,
    height: 96,
  },
});
