import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/ui/components/Card";
import { Header } from "@/ui/components/Header";
import { colors } from "@/ui/theme/colors";
import { spacing } from "@/ui/theme/spacing";
import { fontSize, fontWeight, lineHeight } from "@/ui/theme/typography";

const sections = [
  {
    title: "Algorithmen",
    body: "Schneller Zugriff auf strukturierte Ablaufe fuer haeufige Einsatzlagen.",
  },
  {
    title: "Medikamente",
    body: "Uebersichtliche Referenzen fuer Wirkstoffe, Hinweise und Dosierungen.",
  },
  {
    title: "Offline verfuegbar",
    body: "Die Oberflaeche ist fuer klare Lesbarkeit und schnelle Orientierung ausgelegt.",
  },
];

export default function HomeScreenUI() {
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Header title="ResQBrain" />
        </View>

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.intro}>
            <Text style={styles.eyebrow}>START</Text>
            <Text style={styles.title}>Schnelle Referenz fuer den mobilen Zugriff</Text>
            <Text style={styles.body}>
              Diese UI-Schicht zeigt die Kernbereiche der App als statische,
              praesentationale Oberflaeche.
            </Text>
          </View>

          {sections.map((section) => (
            <Card key={section.title}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{section.title}</Text>
                <Text style={styles.cardBody}>{section.body}</Text>
              </View>
            </Card>
          ))}
        </ScrollView>
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
  },
  contentContainer: {
    paddingHorizontal: spacing.screenPaddingH,
    paddingTop: spacing.sectionGap,
    paddingBottom: spacing.screenPaddingBottom,
    gap: spacing.sectionGap,
  },
  intro: {
    gap: spacing.itemGap,
  },
  eyebrow: {
    color: colors.sky.text,
    fontSize: fontSize.label,
    fontWeight: fontWeight.semibold,
    textTransform: "uppercase",
  },
  title: {
    color: colors.textStrong,
    fontSize: fontSize.h1,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.h1 * lineHeight.snug,
  },
  body: {
    color: colors.textBody,
    fontSize: fontSize.bodySm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.bodySm * lineHeight.relaxed,
  },
  cardContent: {
    gap: spacing.badgeToText,
  },
  cardTitle: {
    color: colors.textStrong,
    fontSize: fontSize.h3,
    fontWeight: fontWeight.bold,
  },
  cardBody: {
    color: colors.textBody,
    fontSize: fontSize.bodySm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.bodySm * lineHeight.relaxed,
  },
});
