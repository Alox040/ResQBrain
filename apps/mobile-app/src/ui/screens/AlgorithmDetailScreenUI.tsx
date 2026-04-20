import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/ui/components/Card";
import { Header } from "@/ui/components/Header";
import { DetailLayout } from "@/ui/patterns/DetailLayout";
import { colors } from "@/ui/theme/colors";
import { spacing } from "@/ui/theme/spacing";
import { fontSize, fontWeight, lineHeight } from "@/ui/theme/typography";

const steps = [
  {
    title: "Lage erfassen",
    body: "Szene sichern, Team orientieren und den Grundablauf sichtbar strukturieren.",
  },
  {
    title: "Initialmassnahmen",
    body: "Basisinterventionen und Monitoring als statische Ablaufdarstellung anordnen.",
  },
  {
    title: "Weiterfuehrende Schritte",
    body: "Naechste Massnahmen als UI-Karten mit klarer Lesereihenfolge darstellen.",
  },
];

export default function AlgorithmDetailScreenUI() {
  return (
    <DetailLayout header={<Header title="Algorithm" />}>
      <View style={styles.hero}>
        <Text style={styles.badge}>ALGORITHMUS</Text>
        <Text style={styles.title}>Reanimation</Text>
        <Text style={styles.subtitle}>Statische Ablaufansicht fuer den visuellen Rebuild-Scope.</Text>
      </View>

      {steps.map((step, index) => (
        <Card key={step.title}>
          <View style={styles.stepHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepTitle}>{step.title}</Text>
          </View>
          <Text style={styles.stepBody}>{step.body}</Text>
        </Card>
      ))}
    </DetailLayout>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.badgeToText,
  },
  badge: {
    alignSelf: "flex-start",
    color: colors.emerald.text,
    fontSize: fontSize.badge,
    fontWeight: fontWeight.semibold,
    textTransform: "uppercase",
  },
  title: {
    color: colors.textStrong,
    fontSize: fontSize.h1,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.h1 * lineHeight.snug,
  },
  subtitle: {
    color: colors.textBody,
    fontSize: fontSize.bodySm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.bodySm * lineHeight.relaxed,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.badgeToText,
    marginBottom: spacing.badgeToText,
  },
  stepBadge: {
    width: spacing.iconContainerXs,
    height: spacing.iconContainerXs,
    borderRadius: spacing.iconContainerXs / 2,
    backgroundColor: colors.emerald.subtle,
    borderWidth: 1,
    borderColor: colors.emerald.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: {
    color: colors.emerald.text,
    fontSize: fontSize.label,
    fontWeight: fontWeight.bold,
  },
  stepTitle: {
    flex: 1,
    color: colors.textStrong,
    fontSize: fontSize.h3,
    fontWeight: fontWeight.bold,
  },
  stepBody: {
    color: colors.textBody,
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.body * lineHeight.relaxed,
  },
});
