import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { hydrateFavorites } from '@/features/favorites/favoritesStore';
import { hydrateHistory } from '@/features/history/historyStore';
import { AppNavigator } from '@/navigation/AppNavigator';

export default function App() {
  React.useEffect(() => {
    void hydrateFavorites();
    void hydrateHistory();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <AppNavigator />
    </NavigationContainer>
  );
}
