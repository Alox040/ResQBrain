import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';
import { algorithms } from '@/features/lookup';
import type { AlgorithmStackParamList } from '@/navigation/AppNavigator';

type AlgorithmListNavigationProp = NativeStackNavigationProp<
  AlgorithmStackParamList,
  'AlgorithmList'
>;

export function AlgorithmListScreen() {
  const navigation = useNavigation<AlgorithmListNavigationProp>();

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

      {algorithms.map((algorithm) => (
        <Pressable
          key={algorithm.id}
          onPress={() =>
            navigation.navigate('AlgorithmDetail', { algorithmId: algorithm.id })
          }
          style={styles.algorithmCard}
        >
          <Text style={styles.algorithmTitle}>{algorithm.title}</Text>
          <Text style={styles.algorithmStage}>Lookup</Text>
          <Text style={styles.algorithmText}>{algorithm.indication}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 16,
    paddingBottom: 24,
    gap: 10,
  },
  headerCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 6,
  },
  headerTitle: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '700',
  },
  headerText: {
    color: '#4b5563',
    fontSize: 15,
    lineHeight: 22,
  },
  algorithmCard: {
    minHeight: 112,
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    justifyContent: 'space-between',
    gap: 8,
  },
  algorithmTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '700',
  },
  algorithmStage: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  algorithmText: {
    color: '#4b5563',
    fontSize: 15,
    lineHeight: 21,
  },
});
