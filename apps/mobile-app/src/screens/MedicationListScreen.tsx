import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { medications } from '@/features/lookup';
import type { MedicationStackParamList } from '@/navigation/AppNavigator';

type MedicationListNavigationProp = NativeStackNavigationProp<
  MedicationStackParamList,
  'MedicationList'
>;

export function MedicationListScreen() {
  const navigation = useNavigation<MedicationListNavigationProp>();

  return (
    <View style={styles.screen}>
      <FlatList
        data={medications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate('MedicationDetail', { medicationId: item.id })
            }
            style={({ pressed }) => [
              styles.row,
              pressed ? styles.rowPressed : null,
            ]}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.subtitle}>{item.indication}</Text>
          </Pressable>
        )}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
  },
  separator: {
    height: 10,
  },
  row: {
    minHeight: 88,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  rowPressed: {
    backgroundColor: '#eef2ff',
    borderColor: '#c7d2fe',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: '#4b5563',
    marginTop: 6,
  },
});
