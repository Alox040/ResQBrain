import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "@/ui/components/Header";
import { MedicationListItem } from "@/ui/components/MedicationListItem";
import { colors } from "@/ui/theme/colors";
import { spacing } from "@/ui/theme/spacing";

const items = [
  { title: "App-Version", subtitle: "ResQBrain Mobile UI 0.1", tag: "INFO" },
  { title: "Ueber", subtitle: "Produkt- und Projektinformationen", tag: "INFO" },
  { title: "Kontakt", subtitle: "Statische Kontaktoption fuer das UI-Layer", tag: "INFO" },
];

const noop = () => {};

export default function SettingsScreenUI() {
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Header title="Settings" />
        </View>

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.list}>
            {items.map((item) => (
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
