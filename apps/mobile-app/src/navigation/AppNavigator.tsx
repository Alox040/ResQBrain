import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { AlgorithmDetailScreen } from '@/screens/AlgorithmDetailScreen';
import { MedicationDetailScreen } from '@/screens/MedicationDetailScreen';
import { AlgorithmListScreen } from '@/screens/AlgorithmListScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { MedicationListScreen } from '@/screens/MedicationListScreen';
import { SearchScreen } from '@/screens/SearchScreen';

export type MedicationStackParamList = {
  MedicationList: undefined;
  MedicationDetail: {
    medicationId: string;
  };
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
        options={{ title: 'Details' }}
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
        options={{ title: 'Details' }}
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
