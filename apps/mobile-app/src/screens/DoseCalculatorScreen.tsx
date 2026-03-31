import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  EmptyState,
  FlatListSeparator,
  LookupListRow,
  SectionHeader,
  WarningCard,
} from '@/components/common';
import { ScreenContainer } from '@/components/layout';
import { medications } from '@/data/contentIndex';
import {
  computeWeightBasedDose,
  formatDoseNumber,
  parseDosageCalculatorSpec,
} from '@/features/doseCalculator/parseDosageForCalculator';
import type { MedicationStackParamList } from '@/navigation/AppNavigator';
import type { Medication } from '@/types/content';
import { CARD, COLORS, SPACING, TYPOGRAPHY } from '@/theme';

type Props = NativeStackScreenProps<
  MedicationStackParamList,
  'DoseCalculator'
>;

function firstMedicationWithSpec(): Medication | undefined {
  for (const m of medications) {
    if (parseDosageCalculatorSpec(m.dosage)) return m;
  }
  return medications[0];
}

export function DoseCalculatorScreen(_props: Props) {
  const initial = useMemo(() => firstMedicationWithSpec(), []);
  const [selected, setSelected] = useState<Medication | undefined>(initial);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [weightText, setWeightText] = useState('');

  const weightKg = useMemo(() => {
    const t = weightText.trim().replace(',', '.');
    if (t === '') return NaN;
    const n = Number.parseFloat(t);
    return Number.isFinite(n) ? n : NaN;
  }, [weightText]);

  const spec = useMemo(
    () => (selected ? parseDosageCalculatorSpec(selected.dosage) : null),
    [selected],
  );

  const result = useMemo(() => {
    if (!spec || !Number.isFinite(weightKg) || weightKg <= 0) return null;
    return computeWeightBasedDose(weightKg, spec);
  }, [spec, weightKg]);

  const weightInvalid =
    weightText.trim() !== '' &&
    (!Number.isFinite(weightKg) || weightKg <= 0);

  if (medications.length === 0) {
    return (
      <ScreenContainer>
        <EmptyState
          when={true}
          message="Keine Medikamente im Bundle."
          hint="Ohne Medikamentenstammdaten ist der Rechner nicht nutzbar."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <WarningCard
          title="Nur Orientierung"
          body="Ergebnis aus dem Dosistext extrahiert — verbindlich bleibt das Medikamentenhandbuch der Organisation. Prüfe Einheiten, Indikation und Kontraindikationen vor jeder Gabe."
          tone="dosage"
          icon="warning-outline"
          accessibilityRole="text"
        />

        <View style={styles.block}>
          <Text style={styles.fieldLabel}>Medikament</Text>
          <Pressable
            onPress={() => setPickerOpen(true)}
            style={({ pressed }) => [
              styles.medSelector,
              pressed && styles.medSelectorPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Medikament wählen. Aktuell ${selected?.label ?? 'keins'}.`}
          >
            <View style={styles.medSelectorTextCol}>
              <Text style={styles.medSelectorTitle} numberOfLines={2}>
                {selected?.label ?? 'Medikament wählen'}
              </Text>
              {selected ? (
                <Text style={styles.medSelectorHint} numberOfLines={2}>
                  {spec
                    ? 'mg/kg-Angabe im Dosistext gefunden'
                    : 'Keine mg/kg-Zeile im Dosistext — Rechner nicht möglich'}
                </Text>
              ) : null}
            </View>
            <Ionicons name="chevron-down" size={26} color={COLORS.primary} />
          </Pressable>
        </View>

        <View style={styles.block}>
          <Text style={styles.fieldLabel}>Körpergewicht (kg)</Text>
          <TextInput
            value={weightText}
            onChangeText={setWeightText}
            placeholder="z. B. 70"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="decimal-pad"
            selectionColor={COLORS.primary}
            style={[styles.weightInput, weightInvalid && styles.weightInputError]}
            accessibilityLabel="Körpergewicht in Kilogramm"
          />
          {weightInvalid ? (
            <Text style={styles.errorLine}>Bitte gültiges Gewicht &gt; 0 eingeben.</Text>
          ) : null}
        </View>

        <View style={styles.resultWrap}>
          {spec && Number.isFinite(weightKg) && weightKg > 0 && result ? (
            <>
              <Text style={styles.resultLabel}>Empfohlene Einzeldosis (Orientierung)</Text>
              <Text style={styles.resultValue} accessibilityRole="header">
                {formatDoseNumber(result.value, result.unit)}
              </Text>
              {result.wasClampedToMin || result.wasClampedToMax ? (
                <Text style={styles.clampHint}>
                  {result.wasClampedToMin && result.wasClampedToMax
                    ? 'Auf Mindest- und Höchstdosis begrenzt.'
                    : result.wasClampedToMin
                      ? 'Auf Mindestdosis begrenzt.'
                      : 'Auf Höchstdosis begrenzt.'}
                  {' '}
                  (Rohwert vor Begrenzung:{' '}
                  {formatDoseNumber(result.rawUncapped, result.unit)})
                </Text>
              ) : null}
            </>
          ) : selected && !spec ? (
            <View style={styles.noSpecCard}>
              <Text style={styles.noSpecTitle}>Keine mg/kg-Angabe erkannt</Text>
              <Text style={styles.noSpecBody}>
                Im Dosistext dieses Eintrags wurde keine Zeile wie „0,1 mg/kg“
                oder „1 µg/kg“ gefunden. Dosis bitte nach Handbuch festlegen.
              </Text>
            </View>
          ) : (
            <Text style={styles.resultPlaceholder}>
              Gewicht eingeben — Ergebnis erscheint automatisch.
            </Text>
          )}
        </View>

        {selected?.dosage ? (
          <View style={styles.dosageExcerpt}>
            <SectionHeader
              title="Dosistext (Auszug)"
              size="compact"
              description="Vollständiger Text in der Medikamenten-Detailansicht."
            />
            <Text style={styles.dosageExcerptText} selectable>
              {selected.dosage.length > 420
                ? `${selected.dosage.slice(0, 420)}…`
                : selected.dosage}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <Modal
        visible={pickerOpen}
        animationType="slide"
        onRequestClose={() => setPickerOpen(false)}
      >
        <ScreenContainer>
          <View style={styles.modalBody}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Medikament wählen</Text>
              <Pressable
                onPress={() => setPickerOpen(false)}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Schließen"
              >
                <Text style={styles.modalClose}>Fertig</Text>
              </Pressable>
            </View>
            <FlatList
              style={styles.modalList}
              data={medications}
              keyExtractor={(m) => m.id}
              ItemSeparatorComponent={FlatListSeparator}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <LookupListRow
                  title={item.label}
                  subtitle={
                    parseDosageCalculatorSpec(item.dosage)
                      ? 'Rechner: mg/kg im Text'
                      : item.indication
                  }
                  onPress={() => {
                    setSelected(item);
                    setPickerOpen(false);
                  }}
                  accessibilityLabel={item.label}
                />
              )}
            />
          </View>
        </ScreenContainer>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    paddingBottom: SPACING.screenPaddingBottom,
    gap: SPACING.detailBlockGap,
  },
  block: {
    gap: SPACING.gapSm,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  medSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 72,
    paddingVertical: 14,
    paddingHorizontal: SPACING.screenPadding,
    ...CARD.base,
    borderWidth: 2,
    borderColor: '#93c5fd',
    gap: SPACING.gapMd,
  },
  medSelectorPressed: {
    backgroundColor: COLORS.primaryMutedBg,
  },
  medSelectorTextCol: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },
  medSelectorTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.text,
  },
  medSelectorHint: {
    ...TYPOGRAPHY.bodyMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  weightInput: {
    ...CARD.base,
    borderWidth: 2,
    borderColor: COLORS.border,
    fontSize: 28,
    fontWeight: '700',
    paddingVertical: 18,
    paddingHorizontal: SPACING.screenPadding,
    color: COLORS.text,
  },
  weightInputError: {
    borderColor: '#f87171',
    backgroundColor: '#fef2f2',
  },
  errorLine: {
    fontSize: 15,
    color: '#dc2626',
    fontWeight: '600',
  },
  resultWrap: {
    ...CARD.base,
    minHeight: 140,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#93c5fd',
    backgroundColor: '#f8fafc',
  },
  resultLabel: {
    ...TYPOGRAPHY.sectionTitle,
    marginBottom: SPACING.gapSm,
  },
  resultValue: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  clampHint: {
    marginTop: SPACING.gapMd,
    fontSize: 15,
    lineHeight: 22,
    color: '#92400e',
    fontWeight: '600',
  },
  resultPlaceholder: {
    fontSize: 17,
    lineHeight: 24,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  noSpecCard: {
    gap: SPACING.gapSm,
  },
  noSpecTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  noSpecBody: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textMuted,
  },
  dosageExcerpt: {
    gap: SPACING.gapSm,
  },
  dosageExcerptText: {
    ...TYPOGRAPHY.body,
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
  },
  modalBody: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.gapMd,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  modalClose: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primary,
  },
  modalList: {
    flex: 1,
  },
});
