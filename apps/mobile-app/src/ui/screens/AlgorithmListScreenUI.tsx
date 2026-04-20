import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "@/ui/components/Header";
import { MedicationListItem } from "@/ui/components/MedicationListItem";
import { colors } from "@/ui/theme/colors";
import { spacing } from "@/ui/theme/spacing";
import { fontSize, fontWeight } from "@/ui/theme/typography";

const algorithms = [
  { title: "Reanimation", subtitle: "Erwachsene - Basisablauf", tag: "ALS" },
  { title: "Bradykardie", subtitle: "Kreislauf - Rhythmus", tag: "ECG" },
  { title: "Tachykardie", subtitle: "Kreislauf - Rhythmus", tag: "ECG" },
  { title: "Anaphylaxie", subtitle: "Allergische Reaktion", tag: "ABC" },
];

const noop = () => {};

export default function AlgorithmListScreenUI() {
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Header title="Algorithmen" />
          <Text style={styles.subline}>Statische Liste zur Darstellung wiederverwendbarer Items.</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.list}>
            {algorithms.map((item) => (
              <MedicationListItem
                key={item.title}
                onPress={noop}
                subtitle={item.subtitle}
                tag={item.tag}
                title={item.title}
              />
            ))}
          </View>
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
    gap: spacing.badgeToText,
  },
  subline: {
    color: colors.textBody,
    fontSize: fontSize.bodySm,
    fontWeight: fontWeight.medium,
  },
  contentContainer: {
    paddingHorizontal: spacing.screenPaddingH,
    paddingTop: spacing.sectionGap,
    paddingBottom: spacing.screenPaddingBottom,
  },
  list: {
    gap: spacing.itemGap,
  },
});
