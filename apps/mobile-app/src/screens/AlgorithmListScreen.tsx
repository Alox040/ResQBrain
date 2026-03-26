import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export function AlgorithmListScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>Algorithmen</Text>
        <Text style={styles.headerText}>
          Grosse Karten fuer Schrittfolgen und schnelle Orientierung.
        </Text>
      </View>

      <View style={styles.algorithmCard}>
        <Text style={styles.algorithmTitle}>Reanimation</Text>
        <Text style={styles.algorithmStage}>Prioritaet hoch</Text>
        <Text style={styles.algorithmText}>
          Rhythmuscheck, Defibrillation, Medikamentenfenster, Teamaufgaben.
        </Text>
      </View>

      <View style={[styles.algorithmCard, styles.greenCard]}>
        <Text style={styles.algorithmTitle}>Anaphylaxie</Text>
        <Text style={styles.algorithmStage}>Sofortmassnahmen</Text>
        <Text style={styles.algorithmText}>
          Atemweg, Sauerstoff, Adrenalin, Volumen, Verlaufskontrolle.
        </Text>
      </View>

      <View style={[styles.algorithmCard, styles.orangeCard]}>
        <Text style={styles.algorithmTitle}>Krampfanfall</Text>
        <Text style={styles.algorithmStage}>Neurologischer Notfall</Text>
        <Text style={styles.algorithmText}>
          Schutz, Monitoring, Benzodiazepin, Atemwegssicherung.
        </Text>
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
    gap: 14,
  },
  headerCard: {
    borderRadius: 24,
    padding: 22,
    backgroundColor: '#132238',
    borderWidth: 1,
    borderColor: '#213657',
    gap: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
  },
  headerText: {
    color: '#c3d2e8',
    fontSize: 15,
    lineHeight: 22,
  },
  algorithmCard: {
    minHeight: 148,
    borderRadius: 24,
    padding: 22,
    backgroundColor: '#7c2d12',
    justifyContent: 'space-between',
    gap: 10,
  },
  greenCard: {
    backgroundColor: '#0f766e',
  },
  orangeCard: {
    backgroundColor: '#b45309',
  },
  algorithmTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '700',
  },
  algorithmStage: {
    color: '#ffedd5',
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  algorithmText: {
    color: '#fff7ed',
    fontSize: 16,
    lineHeight: 23,
  },
});
