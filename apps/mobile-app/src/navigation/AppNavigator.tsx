import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { AlgorithmDetailScreen } from '@/screens/AlgorithmDetailScreen';
import { MedicationDetailScreen } from '@/screens/MedicationDetailScreen';
import { DoseCalculatorScreen } from '@/screens/DoseCalculatorScreen';
import { AlgorithmListScreen } from '@/screens/AlgorithmListScreen';
import { FavoritesScreen } from '@/screens/FavoritesScreen';
import { HistoryScreen } from '@/screens/HistoryScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { MedicationListScreen } from '@/screens/MedicationListScreen';
import { SearchScreen } from '@/screens/SearchScreen';

export type MedicationStackParamList = {
  MedicationList: undefined;
  MedicationDetail: {
    medicationId: string;
  };
  DoseCalculator: undefined;
};

export type AlgorithmStackParamList = {
  AlgorithmList: undefined;
  AlgorithmDetail: {
    algorithmId: string;
  };
};

export type RootTabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  History: undefined;
  MedicationList: NavigatorScreenParams<MedicationStackParamList>;
  AlgorithmList: NavigatorScreenParams<AlgorithmStackParamList>;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const MedicationStack = createNativeStackNavigator<MedicationStackParamList>();
const AlgorithmStack = createNativeStackNavigator<AlgorithmStackParamList>();
const headerStyle = { backgroundColor: '#111827' } as const;
const headerTitleStyle = {
  fontSize: 18,
  fontWeight: '700',
} as const;
const sharedStackScreenOptions = {
  headerStyle,
  headerTintColor: '#f9fafb',
  headerTitleStyle,
  headerBackTitleVisible: false,
  contentStyle: { backgroundColor: '#f3f4f6' },
} as const;

function MedicationStackNavigator() {
  return (
    <MedicationStack.Navigator
      screenOptions={sharedStackScreenOptions}
    >
      <MedicationStack.Screen
        name="MedicationList"
        component={MedicationListScreen}
        options={{ title: 'Medikamente' }}
      />
      <MedicationStack.Screen
        name="MedicationDetail"
        component={MedicationDetailScreen}
        options={{ title: 'Medikament' }}
      />
      <MedicationStack.Screen
        name="DoseCalculator"
        component={DoseCalculatorScreen}
        options={{ title: 'Dosisrechner' }}
      />
    </MedicationStack.Navigator>
  );
}

function AlgorithmStackNavigator() {
  return (
    <AlgorithmStack.Navigator
      screenOptions={sharedStackScreenOptions}
    >
      <AlgorithmStack.Screen
        name="AlgorithmList"
        component={AlgorithmListScreen}
        options={{ title: 'Algorithmen' }}
      />
      <AlgorithmStack.Screen
        name="AlgorithmDetail"
        component={AlgorithmDetailScreen}
        options={{ title: 'Algorithmus' }}
      />
    </AlgorithmStack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle,
        headerTintColor: '#f9fafb',
        headerTitleStyle,
        tabBarStyle: { backgroundColor: '#111827' },
        tabBarActiveTintColor: '#60a5fa',
        tabBarInactiveTintColor: '#9ca3af',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Start' }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Suche' }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'Favoriten',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'Verlauf',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MedicationList"
        component={MedicationStackNavigator}
        options={{ title: 'Medikamente', headerShown: false }}
      />
      <Tab.Screen
        name="AlgorithmList"
        component={AlgorithmStackNavigator}
        options={{ title: 'Algorithmen', headerShown: false }}
      />
    </Tab.Navigator>
  );
}
