import { useRouter } from 'expo-router';
import { createContext, PropsWithChildren, useEffect } from 'react';
import { useAuthStore } from '@/store/auth';

type AuthState = {
  isLoggedIn: boolean;
  isReady: boolean;
  logIn: () => void;
  logOut: () => void;
};

export const AuthContext = createContext<AuthState>({} as AuthState);

export function AuthProvivder({ children }: PropsWithChildren) {
  const router = useRouter();
  const { isLoggedIn, logIn: setLoggedIn, logOut: setLoggedOut } = useAuthStore();

  useEffect(() => {
    if (useAuthStore.persist && useAuthStore.persist.hasHydrated()) {
      if (isLoggedIn) {
        router.replace('/(protected)/(tabs)');
      }
    }
  }, [isLoggedIn, router]);

  const logIn = () => {
    setLoggedIn();

    router.replace('/(protected)/(tabs)');
  };

  const logOut = () => {
    setLoggedOut();

    router.replace('/onboarding');
  };

  const isReady = useAuthStore.persist?.hasHydrated() || false;

  return (
    <AuthContext.Provider value={{ isLoggedIn, isReady, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
