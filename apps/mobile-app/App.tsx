import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ButtonSecondary, EmptyState } from '@/components/common';
import { initializeContent } from '@/data/contentIndex';
import { hydrateHistory } from '@/features/history/historyStore';
import { getBundleDebugInfo, setBundleDebugInfo } from '@/lookup/bundleDebugInfo';
import { applyBundleUpdate, checkForBundleUpdate } from '@/lookup/bundleUpdateService';
import { loadLookupBundleWithSource } from '@/lookup/loadLookupBundle';
import { AppNavigator } from '@/navigation/AppNavigator';
import { hydrateFavorites } from '@/state/favoritesStore';
import { hydrateRecent } from '@/state/recentStore';
import { ThemeProvider, useTheme } from '@/theme/ThemeContext';

async function runBackgroundBundleUpdate(
  bundleUrl: string,
  currentDebugInfo: {
    version: string | null;
    source: 'resolved' | 'embedded' | 'cached' | 'updated' | 'fallback';
    lastUpdate: string | null;
    pendingUpdate: boolean;
  },
): Promise<void> {
  const updateCheck = await checkForBundleUpdate(bundleUrl);
  if (updateCheck.status !== 'update-available') {
    return;
  }

  const applyResult = await applyBundleUpdate(bundleUrl);
  if (applyResult.status === 'updated') {
    await setBundleDebugInfo({
      ...currentDebugInfo,
      lastUpdate: new Date().toISOString(),
      pendingUpdate: true,
    });
  }
}

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
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  const { colors } = useTheme();

  return (
    <View style={[styles.centeredRoot, { backgroundColor: colors.bg }]}>
      <EmptyState
        when={true}
        message="Inhalte konnten nicht geladen werden."
        hint={message}
        action={<ButtonSecondary label="Erneut versuchen" onPress={onRetry} />}
      />
    </View>
  );
}

export default function App() {
  const [ready, setReady] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = React.useState(0);

  React.useEffect(() => {
    void (async () => {
      setReady(false);
      setErrorMessage(null);

      try {
        const bundleUrl = process.env.EXPO_PUBLIC_LOOKUP_BUNDLE_URL;
        const persistedDebugInfo = await getBundleDebugInfo();
        let lastUpdate = persistedDebugInfo?.lastUpdate ?? null;
        let pendingUpdate = persistedDebugInfo?.pendingUpdate ?? false;

        const resolved = await loadLookupBundleWithSource();
        if (pendingUpdate && resolved.source === 'cached') {
          pendingUpdate = false;
        }

        const bundleVersion =
          resolved.store.versionInfo.version ??
          resolved.store.manifest.bundleId ??
          null;

        initializeContent(resolved.store);
        await setBundleDebugInfo({
          version: bundleVersion,
          source: resolved.source,
          lastUpdate,
          pendingUpdate,
        });

        await Promise.all([
          hydrateFavorites(),
          hydrateHistory(),
          hydrateRecent(),
        ]);

        setReady(true);

        if (bundleUrl) {
          void runBackgroundBundleUpdate(bundleUrl, {
            version: bundleVersion,
            source: resolved.source,
            lastUpdate,
            pendingUpdate,
          });
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Inhalte konnten nicht geladen werden.';
        setErrorMessage(message);
        setReady(false);
      }
    })();
  }, [loadAttempt]);

  return (
    <ThemeProvider>
      {ready ? (
        <AppNavigation />
      ) : errorMessage ? (
        <AppError
          message={errorMessage}
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
