import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { createContext, useContext, useEffect, useState } from 'react';

import { NotificationModal } from '@/components/NotificationModal';
import { useColorScheme } from '@/hooks/useColorScheme';
import SplashScreen from './splashScreen';

// Create a context for notification modal
export const NotificationContext = createContext({
  showNotifications: false,
  setShowNotifications: (show: boolean) => {},
});

export const useNotifications = () => useContext(NotificationContext);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showSplash, setShowSplash] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loaded]);

  if (!loaded) return null;
  if (showSplash) return <SplashScreen onComplete={() => setShowSplash(false)} />;

  return (
    <NotificationContext.Provider value={{ showNotifications, setShowNotifications }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack>
          <Stack.Screen name="onboardingScreen" options={{ headerShown: false }} />
          <Stack.Screen name="coinDetailsScreen" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <NotificationModal 
          visible={showNotifications} 
          onClose={() => setShowNotifications(false)} 
        />
      </ThemeProvider>
    </NotificationContext.Provider>
  );
}
