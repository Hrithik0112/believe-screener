import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';

import { NotificationModal } from '@/components/NotificationModal';
import { useColorScheme } from '@/hooks/useColorScheme';
import SplashScreen from './splashScreen';

// Create a context for notification modal
export const NotificationContext = createContext({
  showNotifications: false,
  setShowNotifications: (show: boolean) => {},
});

export const useNotifications = () => useContext(NotificationContext);

// This component will handle protected routes and initial navigation
function InitialLayout() {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Check if user has seen onboarding
    const checkOnboarding = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        if (!isAuthenticated) {
          // If not authenticated, check if they've seen onboarding
          if (hasSeenOnboarding) {
            router.replace('/login');
          } else {
            router.replace('/onboardingScreen');
          }
        } else {
          // If authenticated, go to tabs
          router.replace('/(tabs)');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        router.replace('/onboardingScreen');
      }
    };

    checkOnboarding();
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="onboardingScreen" options={{ headerShown: false }} />
      <Stack.Screen name="coinDetailsScreen" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

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
    <AuthProvider>
      <NotificationContext.Provider value={{ showNotifications, setShowNotifications }}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <InitialLayout />
          <NotificationModal 
            visible={showNotifications} 
            onClose={() => setShowNotifications(false)} 
          />
        </ThemeProvider>
      </NotificationContext.Provider>
    </AuthProvider>
  );
}
