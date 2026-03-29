import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '@/navigation/AppNavigator';
import { CARD, COLORS, SPACING, TYPOGRAPHY } from '@/ui/theme';

export function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroCard}>
        <Text style={styles.eyebrow}>ResQBrain</Text>
        <Text style={styles.title}>Schneller Zugriff auf Notfallwissen</Text>
        <Text style={styles.subtitle}>
          Medikamente, Algorithmen und Suche in einer klaren mobilen
          Oberflaeche.
        </Text>
      </View>

      <View style={styles.quickSection}>
        <Text style={styles.sectionTitle}>Schnellzugriff</Text>

        <Pressable
          onPress={() => navigation.navigate('Search')}
          style={({ pressed }) => [
            styles.largeButton,
            pressed ? styles.largeButtonPressed : null,
          ]}
        >
          <Text style={styles.buttonTitle}>Suche</Text>
          <Text style={styles.buttonText}>
            Medikamente, Protokolle und Begriffe direkt finden
          </Text>
        </Pressable>

        <Pressable
          onPress={() =>
            navigation.navigate('MedicationList', { screen: 'MedicationList' })
          }
          style={({ pressed }) => [
            styles.largeButton,
            styles.secondaryButton,
            pressed ? styles.largeButtonPressed : null,
          ]}
        >
          <Text style={styles.buttonTitle}>Medikamente</Text>
          <Text style={styles.buttonText}>
            Dosierungen, Hinweise und Standardpraeparate uebersichtlich sehen
          </Text>
        </Pressable>

        <Pressable
          onPress={() =>
            navigation.navigate('AlgorithmList', { screen: 'AlgorithmList' })
          }
          style={({ pressed }) => [
            styles.largeButton,
            styles.tertiaryButton,
            pressed ? styles.largeButtonPressed : null,
          ]}
        >
          <Text style={styles.buttonTitle}>Algorithmen</Text>
          <Text style={styles.buttonText}>
            Strukturierte Ablaeufe fuer haeufige Notfallsituationen
          </Text>
        </Pressable>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoCard}>
          <Text style={styles.infoValue}>24/7</Text>
          <Text style={styles.infoLabel}>schnell lesbar</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoValue}>Mobile</Text>
          <Text style={styles.infoLabel}>optimiertes Layout</Text>
        </View>
      </View>
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
  heroCard: {
    ...CARD.base,
    padding: 18,
    gap: 8,
  },
  eyebrow: {
    ...TYPOGRAPHY.sectionTitle,
  },
  title: {
    ...TYPOGRAPHY.title,
    lineHeight: 30,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyMuted,
    color: '#4b5563',
  },
  quickSection: {
    gap: 10,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '700',
  },
  largeButton: {
    minHeight: 108,
    borderRadius: 16,
    padding: 18,
    justifyContent: 'space-between',
    backgroundColor: '#2563eb',
  },
  largeButtonPressed: {
    opacity: 0.9,
  },
  secondaryButton: {
    backgroundColor: '#0f766e',
  },
  tertiaryButton: {
    backgroundColor: '#9a3412',
  },
  buttonTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  buttonText: {
    color: '#eff6ff',
    fontSize: 15,
    lineHeight: 21,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  infoCard: {
    flex: 1,
    ...CARD.base,
    gap: 6,
  },
  infoValue: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
  },
  infoLabel: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
});
