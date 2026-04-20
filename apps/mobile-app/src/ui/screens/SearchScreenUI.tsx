import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "@/ui/components/Header";
import { MedicationListItem } from "@/ui/components/MedicationListItem";
import { SearchBar } from "@/ui/components/SearchBar";
import { colors } from "@/ui/theme/colors";
import { spacing } from "@/ui/theme/spacing";
import { fontSize, fontWeight } from "@/ui/theme/typography";

const results = [
  { title: "Adrenalin", subtitle: "Medikament - Reanimation", tag: "MED" },
  { title: "Tachykardie", subtitle: "Algorithmus - Erwachsene", tag: "ALG" },
  { title: "Midazolam", subtitle: "Medikament - Sedierung", tag: "MED" },
  { title: "Krampfanfall", subtitle: "Algorithmus - Neurologie", tag: "ALG" },
];

const noop = () => {};

export default function SearchScreenUI() {
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Header title="Suche" />
          <View style={styles.searchWrap}>
            <SearchBar
              placeholder="Nach Medikamenten oder Algorithmen suchen"
              value=""
              onChangeText={noop}
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionLabel}>Ergebnisse</Text>
          <View style={styles.list}>
            {results.map((item) => (
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
    gap: spacing.itemGap,
  },
  searchWrap: {
    marginTop: spacing.badgeToText,
  },
  contentContainer: {
    paddingHorizontal: spacing.screenPaddingH,
    paddingTop: spacing.sectionGap,
    paddingBottom: spacing.screenPaddingBottom,
    gap: spacing.itemGap,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: fontSize.label,
    fontWeight: fontWeight.semibold,
    textTransform: "uppercase",
  },
  list: {
    gap: spacing.itemGap,
  },
});
