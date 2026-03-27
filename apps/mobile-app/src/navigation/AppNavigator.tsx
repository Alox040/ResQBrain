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

function MedicationStackNavigator() {
  return (
    <MedicationStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: '#ffffff',
        contentStyle: { backgroundColor: '#f3f4f6' },
      }}
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
      screenOptions={{
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: '#ffffff',
        contentStyle: { backgroundColor: '#f3f4f6' },
      }}
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
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: '#ffffff',
        tabBarStyle: { backgroundColor: '#1a1a2e' },
        tabBarActiveTintColor: '#e94560',
        tabBarInactiveTintColor: '#888888',
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
