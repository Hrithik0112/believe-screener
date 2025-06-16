import { MaterialCommunityIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Animated, { FadeInRight, FadeInUp } from 'react-native-reanimated'
import { useAuth } from '../context/AuthContext'
  
  // Mock user data
  const userData = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    joinDate: 'January 2023',
    avatar: 'AJ',
    portfolioValue: '$125,340.56',
    totalGains: '+$23,456.78',
    gainPercentage: '+23.1%',
    level: 'Gold Trader',
    completedTrades: 147,
    accuracy: '78%'
  }
  
  const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)
  
  export default function Profile() {
    const [pushNotifications, setPushNotifications] = useState(true)
    const [biometricAuth, setBiometricAuth] = useState(false)
    const [darkMode, setDarkMode] = useState(false)
    const [priceAlerts, setPriceAlerts] = useState(true)
  
    const { logout } = useAuth()
    const router = useRouter()
  
    // Handle profile actions
    const handleEditProfile = () => {
      Alert.alert('Edit Profile', 'Profile editing functionality would open here')
    }
  
    const handleChangePassword = () => {
      Alert.alert('Change Password', 'Password change form would open here')
    }
  
    const handleBackupWallet = () => {
      Alert.alert(
        'Backup Wallet',
        'Are you sure you want to backup your wallet? Make sure you\'re in a secure location.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Backup', onPress: () => console.log('Backup wallet') }
        ]
      )
    }
  
    const handleSupport = () => {
      Alert.alert('Support', 'Contact support functionality would open here')
    }
  
    const handleSignOut = () => {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Sign Out', 
            style: 'destructive', 
            onPress: async () => {
              await logout()
              router.replace('/login')
            }
          }
        ]
      )
    }
  
    // Profile stats component
    const ProfileStat = ({ label, value, color, icon }: { label: string; value: string; color: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }) => (
      <Animated.View entering={FadeInRight.delay(300).springify()} style={styles.statItem}>
        <MaterialCommunityIcons name={icon} size={24} color={color} style={styles.statIcon} />
        <View>
          <Text adjustsFontSizeToFit style={[styles.statValue, { color }]}>{value}</Text>
          <Text adjustsFontSizeToFit style={styles.statLabel}>{label}</Text>
        </View>
      </Animated.View>
    )
  
    // Menu item component
    const MenuItem = ({ icon, title, subtitle, onPress, rightComponent, showArrow = true }: { icon: string, title: string, subtitle: string, onPress: () => void, rightComponent: React.ReactNode, showArrow?: boolean }) => (
      <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.menuIconContainer}>
          <Text style={styles.menuIcon}>{icon}</Text>
        </View>
        <View style={styles.menuContent}>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
        <View style={styles.menuRight}>
          {rightComponent}
          {showArrow && <Text style={styles.menuArrow}>›</Text>}
        </View>
      </TouchableOpacity>
    )
  
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerBackground} />
          <View style={styles.profileSection}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{userData.avatar}</Text>
              </View>
              <TouchableOpacity style={styles.editAvatarButton}>
                <Text style={styles.editAvatarText}>📷</Text>
              </TouchableOpacity>
            </View>
            
            {/* User Info */}
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userData.name}</Text>
              <Text style={styles.userEmail}>{userData.email}</Text>
              <View style={styles.userBadge}>
                <Text style={styles.badgeText}>{userData.level}</Text>
              </View>
            </View>
          </View>
        </View>
  
        {/* Portfolio Stats */}
        <AnimatedLinearGradient
          entering={FadeInUp.delay(200).springify()}
          colors={darkMode ? ['#2C2C2E', '#1C1C1E'] : ['#FFFFFF', '#F8F8F8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statsCard}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.statsTitle, { color: darkMode ? '#FFFFFF' : '#1a1a1a' }]}>
              Portfolio Overview
            </Text>
            <MaterialCommunityIcons 
              name="trending-up" 
              size={24} 
              color={darkMode ? '#4CAF50' : '#00C851'} 
            />
          </View>
          
          <View style={styles.statsRow}>
            <ProfileStat 
              label="Total Value" 
              value={userData.portfolioValue} 
              color="#FF6B35"
              icon="wallet-outline"
            />
            <ProfileStat 
              label="Total Gains" 
              value={userData.totalGains} 
              color="#00C851"
              icon="chart-line-variant"
            />
            <ProfileStat 
              label="Success Rate" 
              value={userData.accuracy} 
              color="#007AFF"
              icon="target"
            />
          </View>

          <View style={styles.divider} />
          
          <View style={styles.additionalStats}>
            <MaterialCommunityIcons 
              name="clock-outline" 
              size={16} 
              color={darkMode ? '#8E8E93' : '#666666'} 
              style={styles.timeIcon}
            />
            <Text style={[styles.additionalStatsText, { color: darkMode ? '#8E8E93' : '#666666' }]}>
              Member since {userData.joinDate} • {userData.completedTrades} trades completed
            </Text>
          </View>
        </AnimatedLinearGradient>
  
        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="👤"
              title="Edit Profile"
              subtitle="Update your personal information"
              onPress={handleEditProfile}
              rightComponent={<View />}
            />
            <MenuItem
              icon="🔒"
              title="Change Password"
              subtitle="Update your security credentials"
              onPress={handleChangePassword}
              rightComponent={<View />}
            />
            <MenuItem
              icon="💳"
              title="Payment Methods"
              subtitle="Manage cards and bank accounts"
              onPress={() => Alert.alert('Payment Methods', 'Payment methods screen')}
              rightComponent={<View />}
            />
            <MenuItem
              icon="🏦"
              title="Backup Wallet"
              subtitle="Secure your crypto assets"
              onPress={handleBackupWallet}
              rightComponent={<View />}
            />
          </View>
        </View>
  
        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="🔔" 
              title="Push Notifications"
              subtitle="Get alerts for price changes"
              onPress={() => {}}
              rightComponent={
                <Switch
                  value={pushNotifications}
                  onValueChange={setPushNotifications}
                  trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                  thumbColor={pushNotifications ? '#FFFFFF' : '#FFFFFF'}
                />
              }
              showArrow={false}
            />
            <MenuItem
              icon="📱"
              onPress={() => {}}
              title="Biometric Authentication"
              subtitle="Use Face ID or Touch ID"
              rightComponent={
                <Switch
                  value={biometricAuth}
                  onValueChange={setBiometricAuth}
                  trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                  thumbColor={biometricAuth ? '#FFFFFF' : '#FFFFFF'}
                />
              }
              showArrow={false}
            />
            <MenuItem
              icon="🌙"
              onPress={() => {}}
              title="Dark Mode"
              subtitle="Switch to dark theme"
              rightComponent={
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                  thumbColor={darkMode ? '#FFFFFF' : '#FFFFFF'}
                />
              }
              showArrow={false}
            />
            <MenuItem
              icon="⚡"
              onPress={() => {}}
              title="Price Alerts"
              subtitle="Notify when targets are reached"
              rightComponent={
                <Switch
                  value={priceAlerts}
                  onValueChange={setPriceAlerts}
                  trackColor={{ false: '#E5E5EA', true: '#007AFF' }}
                  thumbColor={priceAlerts ? '#FFFFFF' : '#FFFFFF'}
                />
              }
              showArrow={false}
            />
          </View>
        </View>
  
        {/* Help & Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="❓"
              title="Help Center"
              subtitle="Find answers to common questions"
              onPress={() => Alert.alert('Help Center', 'Help center would open')}
              rightComponent={<View />}
            />
            <MenuItem
              icon="💬"
              rightComponent={<View />}
              title="Contact Support"
              subtitle="Get help from our team"
              onPress={handleSupport}
            />
            <MenuItem
              rightComponent={<View />}
              icon="⭐"
              title="Rate App"
              subtitle="Share your feedback"
              onPress={() => Alert.alert('Rate App', 'App store rating would open')}
            />
            <MenuItem
              rightComponent={<View />}
              icon="📄"
              title="Terms & Privacy"
              subtitle="Read our policies"
              onPress={() => Alert.alert('Terms & Privacy', 'Legal documents would open')}
            />
          </View>
        </View>
  
        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
  
        {/* Version Info */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Believe Screener v1.0.0</Text>
        </View>
      </ScrollView>
    )
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA',
    },
    header: {
      position: 'relative',
      paddingBottom: 20,
    },
    headerBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 400,
      backgroundColor: '#FF6B35',
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    profileSection: {
      paddingTop: 60,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: 16,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    avatarText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#007AFF',
    },
    editAvatarButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    editAvatarText: {
      fontSize: 14,
    },
    userInfo: {
      alignItems: 'center',
    },
    userName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: 12,
    },
    userBadge: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    badgeText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    statsCard: {
      borderRadius: 20,
      padding: 20,
      marginHorizontal: 16,
      marginVertical: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    statsTitle: {
      fontSize: 20,
      fontWeight: '700',
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statIcon: {
      marginBottom: 8,
    },
    statValue: {
      fontSize: 14,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: '#8E8E93',
      textAlign: 'center',
    },
    divider: {
      height: 1,
      backgroundColor: 'rgba(142, 142, 147, 0.2)',
      marginVertical: 16,
    },
    additionalStats: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    timeIcon: {
      marginRight: 6,
    },
    additionalStatsText: {
      fontSize: 13,
      textAlign: 'center',
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#1A1A1A',
      marginBottom: 12,
      marginHorizontal: 20,
    },
    menuContainer: {
      backgroundColor: '#FFFFFF',
      marginHorizontal: 20,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#F5F5F5',
    },
    menuIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: '#F8F9FA',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    menuIcon: {
      fontSize: 16,
    },
    menuContent: {
      flex: 1,
    },
    menuTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: '#1A1A1A',
      marginBottom: 2,
    },
    menuSubtitle: {
      fontSize: 14,
      color: '#666',
    },
    menuRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuArrow: {
      fontSize: 18,
      color: '#C7C7CC',
      marginLeft: 8,
    },
    signOutButton: {
      backgroundColor: '#FF3B30',
      marginHorizontal: 20,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    signOutText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    versionInfo: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    versionText: {
      fontSize: 14,
      color: '#999',
    },
  })