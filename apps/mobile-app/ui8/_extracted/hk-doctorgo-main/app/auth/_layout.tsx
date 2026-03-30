import { AuthContext } from '@/utils/auth-context';
import { Redirect, Stack } from 'expo-router';
import { useContext } from 'react';

export default function AuthLayout() {
  const authState = useContext(AuthContext);

  if (!authState.isReady) {
    return null;
  }

  if (authState.isLoggedIn) {
    return <Redirect href="/(protected)/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
