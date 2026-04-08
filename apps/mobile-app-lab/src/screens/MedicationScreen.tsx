import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { SearchBar } from "../components/SearchBar";
import { colors, radius, spacing, typography } from "../theme/tokens";

export function MedicationScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Medication</Text>
          <Text style={styles.title}>Medication</Text>
          <Text style={styles.subtitle}>Reserved space for dosage references, favorites, and quick picks.</Text>
        </View>

        <SearchBar placeholder="Search medications" />

        <View style={styles.contentArea}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pinned Drugs</Text>
            <View style={styles.row}>
              <View style={styles.featureCard} />
              <View style={styles.featureCard} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reference List</Text>
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
    color: colors.brand.accent,
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
  featureCard: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radius["2xl"],
    borderWidth: 1,
    flex: 1,
    height: 132,
  },
  listCard: {
    backgroundColor: colors.background.surfaceElevated,
    borderColor: colors.border.default,
    borderRadius: radius.xl,
    borderWidth: 1,
    height: 84,
  },
});
