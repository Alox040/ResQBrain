import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getAlgorithmById, getMedicationById } from '@/data/contentIndex';
import type { MedicationStackParamList, RootTabParamList } from '@/navigation/AppNavigator';
import { CARD, COLORS, SPACING, TYPOGRAPHY } from '@/ui/theme';

type Props = NativeStackScreenProps<
  MedicationStackParamList,
  'MedicationDetail'
>;

export function MedicationDetailScreen({ navigation, route }: Props) {
  const medication = getMedicationById(route.params.medicationId);
  const tabNavigation = navigation.getParent<BottomTabNavigationProp<RootTabParamList>>();

  const openAlgorithm = (algorithmId: string) => {
    tabNavigation?.navigate('AlgorithmList', {
      screen: 'AlgorithmDetail',
      params: { algorithmId },
    });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: medication?.label ?? 'Medikament' });
  }, [navigation, medication?.label]);

  if (!medication) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Medikament nicht gefunden</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Indikation</Text>
        <Text style={styles.value}>{medication.indication}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Dosierung</Text>
        <Text style={styles.value}>{medication.dosage}</Text>
      </View>

      {medication.notes ? (
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Notizen</Text>
          <Text style={styles.value}>{medication.notes}</Text>
        </View>
      ) : null}

      {medication.relatedAlgorithmIds.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Verwandte Algorithmen</Text>
          {medication.relatedAlgorithmIds.map((algorithmId) => {
            const alg = getAlgorithmById(algorithmId);
            if (alg) {
              return (
                <Pressable
                  key={algorithmId}
                  onPress={() => openAlgorithm(algorithmId)}
                  style={({ pressed }) => [styles.crossRefRow, pressed && styles.crossRefRowPressed]}
                  accessibilityRole="button"
                  accessibilityLabel={`Algorithmus ${alg.label} öffnen`}
                >
                  <Text style={styles.crossRefLabel}>{alg.label}</Text>
                  <Text style={styles.crossRefChevron}>›</Text>
                </Pressable>
              );
            }
            return (
              <Text key={algorithmId} style={styles.crossRefMissing}>
                Unbekannte ID: {algorithmId}
              </Text>
            );
          })}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: SPACING.screenPadding,
    paddingBottom: SPACING.screenPaddingBottom,
    gap: SPACING.gapMd,
  },
  card: {
    ...CARD.base,
    gap: 6,
  },
  sectionLabel: {
    ...TYPOGRAPHY.sectionTitle,
  },
  value: {
    ...TYPOGRAPHY.body,
  },
  crossRefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  crossRefRowPressed: {
    backgroundColor: COLORS.primaryMutedBg,
  },
  crossRefLabel: {
    ...TYPOGRAPHY.body,
    flex: 1,
    color: COLORS.primary,
    fontWeight: '600',
  },
  crossRefChevron: {
    fontSize: 20,
    color: COLORS.textMuted,
    marginLeft: 8,
  },
  crossRefMissing: {
    ...TYPOGRAPHY.bodyMuted,
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.bg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
});
