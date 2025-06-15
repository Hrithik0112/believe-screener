import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';

interface HeaderProps {
  onNotificationPress?: () => void;
}

export const AppHeader: React.FC<HeaderProps> = ({ onNotificationPress }) => {
  const colorScheme = useColorScheme();
  
  const isDark = colorScheme === 'dark';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
      <View style={[styles.header, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
        {/* Left side - Logo and App Name */}
        <View style={styles.leftSection}>
          <View style={[styles.logoContainer, { backgroundColor: isDark ? '#2C2C2E' : '#fff5f2' }]}>
            <FontAwesome5 name="asterisk" size={20} color="#FF6B35" />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.believeText, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
              Believe
            </Text>
            <Text style={styles.screenerText}>Screener</Text>
          </View>
        </View>

        {/* Right side - Notification Icon */}
        <TouchableOpacity 
          style={[styles.notificationButton, { backgroundColor: isDark ? '#2C2C2E' : '#F8F8F8' }]}
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="notifications-outline" 
            size={22} 
            color={isDark ? '#FFFFFF' : '#1a1a1a'} 
          />
          {/* Notification badge */}
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  believeText: {
    fontSize: 20,
    fontWeight: '700',
    marginRight: 4,
  },
  screenerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF6B35',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
});