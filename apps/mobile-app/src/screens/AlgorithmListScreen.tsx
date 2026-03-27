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
