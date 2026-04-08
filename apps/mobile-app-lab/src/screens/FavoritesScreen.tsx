import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { SearchBar } from "../components/SearchBar";
import { colors, radius, spacing, typography } from "../theme/tokens";

export function FavoritesScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Library</Text>
          <Text style={styles.title}>Favorites</Text>
          <Text style={styles.subtitle}>Saved content placeholders for medications, algorithms, and notes.</Text>
        </View>

        <SearchBar placeholder="Search favorites" />

        <View style={styles.contentArea}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Collections</Text>
            <View style={styles.row}>
              <View style={styles.collectionCard} />
              <View style={styles.collectionCard} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Saved Items</Text>
            <View style={styles.savedCard} />
            <View style={styles.savedCard} />
            <View style={styles.savedCard} />
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
    color: colors.brand.secondary,
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
  collectionCard: {
    backgroundColor: colors.background.surface,
    borderColor: colors.border.default,
    borderRadius: radius["2xl"],
    borderWidth: 1,
    flex: 1,
    height: 120,
  },
  savedCard: {
    backgroundColor: colors.background.surfaceElevated,
    borderColor: colors.border.default,
    borderRadius: radius.xl,
    borderWidth: 1,
    height: 88,
  },
});
