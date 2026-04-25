import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ButtonSecondary, EmptyState } from '@/components/common';
import {
  ensureContentStoreReady,
  getContentVersionInfo,
} from '@/data/contentIndex';
import { hydrateHistory } from '@/features/history/historyStore';
import { getBundleDebugInfo, setBundleDebugInfo } from '@/lookup/bundleDebugInfo';
import { toLookupUiErrorState } from '@/lookup/lookupErrors';
import { AppNavigator } from '@/navigation/AppNavigator';
import { hydrateFavorites } from '@/state/favoritesStore';
import { hydrateRecent } from '@/state/recentStore';
import { ThemeProvider, useTheme } from '@/theme/ThemeContext';

function AppNavigation() {
  const { navigationTheme, isDark } = useTheme();

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </NavigationContainer>
  );
}

function AppLoading() {
  const { colors } = useTheme();

  return (
    <View style={[styles.centeredRoot, { backgroundColor: colors.bg }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.loadingText, { color: colors.textMuted }]}>
        Inhalte werden geladen …
      </Text>
    </View>
  );
}

function AppError({
  errorState,
  onRetry,
}: {
  errorState: {
    message: string;
    hint: string;
  };
  onRetry: () => void;
}) {
  const { colors } = useTheme();

  return (
    <View style={[styles.centeredRoot, { backgroundColor: colors.bg }]}>
      <EmptyState
        when={true}
        message={errorState.message}
        hint={errorState.hint}
        action={<ButtonSecondary label="Erneut versuchen" onPress={onRetry} />}
      />
    </View>
  );
}

export default function App() {
  const [ready, setReady] = React.useState(false);
  const [errorState, setErrorState] = React.useState<{
    message: string;
    hint: string;
  } | null>(null);
  const [loadAttempt, setLoadAttempt] = React.useState(0);

  React.useEffect(() => {
    void (async () => {
      setReady(false);
      setErrorState(null);

      try {
        const persistedDebugInfo = await getBundleDebugInfo();
        await ensureContentStoreReady();
        const versionInfo = getContentVersionInfo();
        const bundleVersion = versionInfo.version ?? null;

        await setBundleDebugInfo({
          version: bundleVersion,
          source: 'embedded',
          lastUpdate: persistedDebugInfo?.lastUpdate ?? null,
          pendingUpdate: false,
        });

        await Promise.all([
          hydrateFavorites(),
          hydrateHistory(),
          hydrateRecent(),
        ]);

        setReady(true);
      } catch (error) {
        setErrorState(toLookupUiErrorState(error));
        setReady(false);
      }
    })();
  }, [loadAttempt]);

  return (
    <ThemeProvider>
      {ready ? (
        <AppNavigation />
      ) : errorState ? (
        <AppError
          errorState={errorState}
          onRetry={() => {
            setLoadAttempt((value) => value + 1);
          }}
        />
      ) : (
        <AppLoading />
      )}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  centeredRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
});
