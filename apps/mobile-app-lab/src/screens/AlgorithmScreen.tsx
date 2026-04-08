import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { SearchBar } from "../components/SearchBar";
import { colors, radius, spacing, typography } from "../theme/tokens";

export function AlgorithmScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Protocols</Text>
          <Text style={styles.title}>Algorithms</Text>
          <Text style={styles.subtitle}>Static scaffolding for pathways, decision cards, and step sequences.</Text>
        </View>

        <SearchBar placeholder="Search algorithms" />

        <View style={styles.contentArea}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Pathway</Text>
            <View style={styles.heroCard}>
              <View style={styles.heroMarker} />
              <View style={styles.heroLineLong} />
              <View style={styles.heroLineShort} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Steps</Text>
            <View style={styles.stepCard} />
            <View style={styles.stepCard} />
            <View style={styles.stepCard} />
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
  heroCard: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radius["2xl"],
    borderWidth: 1,
    gap: spacing[4],
    padding: spacing.cardPaddingLg,
  },
  heroMarker: {
    backgroundColor: colors.brand.primarySoft,
    borderRadius: radius.md,
    height: 48,
    width: 48,
  },
  heroLineLong: {
    backgroundColor: colors.background.surfaceTint,
    borderRadius: radius.sm,
    height: 18,
    width: "78%",
  },
  heroLineShort: {
    backgroundColor: colors.background.surfaceTint,
    borderRadius: radius.sm,
    height: 14,
    width: "52%",
  },
  stepCard: {
    backgroundColor: colors.background.surfaceElevated,
    borderColor: colors.border.default,
    borderRadius: radius.xl,
    borderWidth: 1,
    height: 104,
  },
});
