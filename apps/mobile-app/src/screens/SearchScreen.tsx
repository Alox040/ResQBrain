import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { mockSearchResults } from '@/search/mockData';
import type { RootTabParamList } from '@/navigation/AppNavigator';
import type { SearchResultItem } from '@/search/types';

export function SearchScreen() {
  const [query, setQuery] = useState('');
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery
    ? mockSearchResults.filter((item) => {
        const primaryText =
          item.kind === 'medication' ? item.name : item.title;
        const secondaryText = item.subtitle ?? '';

        return (
          primaryText.toLowerCase().includes(normalizedQuery) ||
          secondaryText.toLowerCase().includes(normalizedQuery)
        );
      })
    : [];

  const handlePressResult = (item: SearchResultItem) => {
    if (item.kind === 'medication') {
      navigation.navigate('MedicationList', {
        screen: 'MedicationDetail',
        params: { medicationId: item.id },
      });
      return;
    }

    navigation.navigate('AlgorithmList', {
      screen: 'AlgorithmDetail',
      params: { algorithmId: item.id },
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Suche</Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Medikament oder Algorithmus suchen"
          placeholderTextColor="#6b7280"
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />

        {!normalizedQuery ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Suche starten</Text>
            <Text style={styles.emptyText}>
              Gib einen Medikamenten- oder Algorithmusnamen ein.
            </Text>
          </View>
        ) : results.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Keine Treffer</Text>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const title = item.kind === 'medication' ? item.name : item.title;
              const kindLabel =
                item.kind === 'medication' ? 'Medikament' : 'Algorithmus';

              return (
                <Pressable
                  onPress={() => handlePressResult(item)}
                  style={styles.resultRow}
                >
                  <Text style={styles.resultKind}>{kindLabel}</Text>
                  <Text style={styles.resultTitle}>{title}</Text>
                  {item.subtitle ? (
                    <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
                  ) : null}
                </Pressable>
              );
            }}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 24,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  emptyState: {
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  listContent: {
    gap: 10,
  },
  resultRow: {
    minHeight: 84,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  resultKind: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  resultTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#111827',
  },
  resultSubtitle: {
    fontSize: 15,
    color: '#4b5563',
    marginTop: 6,
    lineHeight: 21,
  },
});
