import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/ui/components/Card";
import { Header } from "@/ui/components/Header";
import { DetailLayout } from "@/ui/patterns/DetailLayout";
import { colors } from "@/ui/theme/colors";
import { spacing } from "@/ui/theme/spacing";
import { fontSize, fontWeight, lineHeight } from "@/ui/theme/typography";

export default function MedicationDetailScreenUI() {
  return (
    <DetailLayout header={<Header title="Medication" />}>
      <View style={styles.hero}>
        <Text style={styles.badge}>MEDIKAMENT</Text>
        <Text style={styles.title}>Adrenalin</Text>
        <Text style={styles.subtitle}>Katecholamin fuer Reanimation und Notfallsituationen</Text>
      </View>

      <Card>
        <View style={styles.cardContent}>
          <Text style={styles.cardLabel}>Beschreibung</Text>
          <Text style={styles.cardText}>
            Statische Referenzkarte fuer Indikation und grundlegende Einordnung ohne
            fachliche Logik.
          </Text>
        </View>
      </Card>

      <Card>
        <View style={styles.cardContent}>
          <Text style={styles.cardLabel}>Dosierung</Text>
          <Text style={styles.cardText}>1 mg i.v./i.o. gemaess lokalem Standard.</Text>
        </View>
      </Card>

      <Card>
        <View style={styles.cardContent}>
          <Text style={styles.cardLabel}>Hinweis</Text>
          <Text style={styles.cardText}>
            Diese Screen-Variante ist rein praesentational und dient nur der
            visuellen Abbildung des Detail-Layouts.
          </Text>
        </View>
      </Card>
    </DetailLayout>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.badgeToText,
  },
  badge: {
    alignSelf: "flex-start",
    color: colors.sky.text,
    fontSize: fontSize.badge,
    fontWeight: fontWeight.semibold,
    textTransform: "uppercase",
  },
  title: {
    color: colors.textStrong,
    fontSize: fontSize.h1Large,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.h1Large * lineHeight.snug,
  },
  subtitle: {
    color: colors.textBody,
    fontSize: fontSize.bodySm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.bodySm * lineHeight.relaxed,
  },
  cardContent: {
    gap: spacing.badgeToText,
  },
  cardLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.label,
    fontWeight: fontWeight.semibold,
    textTransform: "uppercase",
  },
  cardText: {
    color: colors.textBody,
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.body * lineHeight.relaxed,
  },
});
