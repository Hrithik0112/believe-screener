import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AppHeader } from '@/components/AppHeader';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const getTabBarActiveTintColor = () => '#FF6B35';
  const getTabBarInactiveTintColor = () => colorScheme === 'dark' ? '#8E8E93' : '#999999';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: getTabBarActiveTintColor(),
        tabBarInactiveTintColor: getTabBarInactiveTintColor(),
        headerShown: true,
        header: () => <AppHeader />,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: colorScheme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
            borderTopColor: colorScheme === 'dark' ? '#333' : '#E5E5E5',
          },
          android: {
            backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
            borderTopColor: colorScheme === 'dark' ? '#333' : '#E5E5E5',
            borderTopWidth: 1,
            elevation: 8,
          },
          default: {},
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons 
              name="dashboard" 
              size={24} 
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "search" : "search-outline"} 
              size={24} 
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: 'Watchlist',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5 
              name={focused ? "heart" : "heart"} 
              size={22} 
              color={color}
              solid={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5 
              name={focused ? "user-alt" : "user"} 
              size={22} 
              color={color}
              solid={focused}
            />
          ),
        }}
      />
      
    </Tabs>
  );
}