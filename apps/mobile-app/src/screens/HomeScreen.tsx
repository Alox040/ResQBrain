import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export function HomeScreen() {
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

        <View style={styles.largeButton}>
          <Text style={styles.buttonTitle}>Suche</Text>
          <Text style={styles.buttonText}>
            Medikamente, Protokolle und Begriffe direkt finden
          </Text>
        </View>

        <View style={[styles.largeButton, styles.secondaryButton]}>
          <Text style={styles.buttonTitle}>Medikamente</Text>
          <Text style={styles.buttonText}>
            Dosierungen, Hinweise und Standardpraeparate uebersichtlich sehen
          </Text>
        </View>

        <View style={[styles.largeButton, styles.tertiaryButton]}>
          <Text style={styles.buttonTitle}>Algorithmen</Text>
          <Text style={styles.buttonText}>
            Strukturierte Ablaeufe fuer haeufige Notfallsituationen
          </Text>
        </View>
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
    backgroundColor: '#09111f',
  },
  content: {
    padding: 20,
    paddingBottom: 28,
    gap: 18,
  },
  heroCard: {
    backgroundColor: '#132238',
    borderRadius: 28,
    padding: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: '#213657',
  },
  eyebrow: {
    color: '#8ec5ff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#f5f7fb',
    lineHeight: 36,
  },
  subtitle: {
    color: '#c3d2e8',
    fontSize: 16,
    lineHeight: 24,
  },
  quickSection: {
    gap: 14,
  },
  sectionTitle: {
    color: '#f5f7fb',
    fontSize: 20,
    fontWeight: '700',
  },
  largeButton: {
    minHeight: 128,
    borderRadius: 24,
    padding: 22,
    justifyContent: 'space-between',
    backgroundColor: '#1d4ed8',
  },
  secondaryButton: {
    backgroundColor: '#0f766e',
  },
  tertiaryButton: {
    backgroundColor: '#9a3412',
  },
  buttonTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
  buttonText: {
    color: '#eff6ff',
    fontSize: 16,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#101b2d',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1c2b43',
    gap: 6,
  },
  infoValue: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  infoLabel: {
    color: '#9fb2cf',
    fontSize: 14,
  },
});
