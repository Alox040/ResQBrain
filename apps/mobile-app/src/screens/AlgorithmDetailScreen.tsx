import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getAlgorithmById, getMedicationById } from '@/data/contentIndex';
import type { AlgorithmStackParamList, RootTabParamList } from '@/navigation/AppNavigator';
import { CARD, COLORS, SPACING, TYPOGRAPHY } from '@/ui/theme';

type Props = NativeStackScreenProps<AlgorithmStackParamList, 'AlgorithmDetail'>;

export function AlgorithmDetailScreen({ navigation, route }: Props) {
  const algorithm = getAlgorithmById(route.params.algorithmId);
  const tabNavigation = navigation.getParent<BottomTabNavigationProp<RootTabParamList>>();

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: algorithm?.label ?? 'Algorithmus' });
  }, [navigation, algorithm?.label]);

  if (!algorithm) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Algorithmus nicht gefunden</Text>
      </View>
    );
  }

  const openMedication = (medicationId: string) => {
    tabNavigation?.navigate('MedicationList', {
      screen: 'MedicationDetail',
      params: { medicationId },
    });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {algorithm.warnings ? (
        <View style={styles.warningCard} accessibilityRole="alert">
          <Text style={styles.warningTitle}>Warnhinweis</Text>
          <Text style={styles.warningBody}>{algorithm.warnings}</Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Indikation</Text>
        <Text style={styles.value}>{algorithm.indication}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Schritte</Text>
        <View style={styles.steps}>
          {algorithm.steps.map((step, index) => (
            <View key={index} style={styles.stepCard}>
              <Text style={styles.stepLabel}>
                Schritt {index + 1} von {algorithm.steps.length}
              </Text>
              <Text style={styles.value}>{step.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {algorithm.notes ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Notizen</Text>
          <Text style={styles.value}>{algorithm.notes}</Text>
        </View>
      ) : null}

      {algorithm.relatedMedicationIds.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Verwandte Medikamente</Text>
          {algorithm.relatedMedicationIds.map((medicationId) => {
            const med = getMedicationById(medicationId);
            if (med) {
              return (
                <Pressable
                  key={medicationId}
                  onPress={() => openMedication(medicationId)}
                  style={({ pressed }) => [styles.medLink, pressed && styles.medLinkPressed]}
                  accessibilityRole="button"
                  accessibilityLabel={`Medikament ${med.label} öffnen`}
                >
                  <Text style={styles.medLinkText}>{med.label}</Text>
                  <Text style={styles.medLinkChevron}>›</Text>
                </Pressable>
              );
            }
            return (
              <Text key={medicationId} style={styles.missingRef}>
                Unbekannte ID: {medicationId}
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
  warningCard: {
    borderRadius: SPACING.radius,
    padding: SPACING.screenPadding,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#f59e0b',
    gap: 8,
  },
  warningTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#b45309',
  },
  warningBody: {
    ...TYPOGRAPHY.body,
    color: '#78350f',
  },
  card: {
    ...CARD.base,
    gap: 8,
  },
  sectionTitle: {
    ...TYPOGRAPHY.sectionTitle,
  },
  value: {
    ...TYPOGRAPHY.body,
  },
  steps: {
    gap: 8,
  },
  stepCard: {
    borderRadius: SPACING.radiusSm,
    padding: 12,
    backgroundColor: COLORS.primaryMutedBg,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    gap: 6,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#1d4ed8',
  },
  medLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  medLinkPressed: {
    backgroundColor: COLORS.primaryMutedBg,
  },
  medLinkText: {
    ...TYPOGRAPHY.body,
    flex: 1,
    color: COLORS.primary,
    fontWeight: '600',
  },
  medLinkChevron: {
    fontSize: 20,
    color: COLORS.textMuted,
    marginLeft: 8,
  },
  missingRef: {
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
