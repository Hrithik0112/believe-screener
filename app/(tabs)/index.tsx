import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { AppHeader } from '@/components/AppHeader';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';

// Mock data - replace with real API data
const marketStats = {
  totalVolume: '$45.2B',
  totalMarketCap: '$2.1T',
  activeCryptos: '27,586',
  topGainer: '+127.5%',
};

const cryptoList = [
  {
    id: '1',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: '$67,234.50',
    change24h: '+2.45%',
    changeColor: '#4CAF50',
    marketCap: '$1.3T',
    volume: '$28.5B',
  },
  {
    id: '2',
    name: 'Ethereum',
    symbol: 'ETH',
    price: '$3,421.80',
    change24h: '-1.23%',
    changeColor: '#F44336',
    marketCap: '$411.2B',
    volume: '$15.2B',
  },
  {
    id: '3',
    name: 'Launch Coin',
    symbol: 'LAUNCH',
    price: '$0.145842',
    change24h: '-4.24%',
    changeColor: '#F44336',
    marketCap: '$145.81M',
    volume: '$32.69M',
  },
  {
    id: '4',
    name: 'Dupe',
    symbol: 'DUPE',
    price: '$0.012673',
    change24h: '-3.44%',
    changeColor: '#F44336',
    marketCap: '$12.67M',
    volume: '$912.53K',
  },
  {
    id: '5',
    name: 'CreatorBuddy',
    symbol: 'BUDDY',
    price: '$0.009030',
    change24h: '-7.62%',
    changeColor: '#F44336',
    marketCap: '$9.03M',
    volume: '$1.04M',
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const router = useRouter();

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  const handleViewAllPress = () => {
    console.log('View all pressed');
  };

  const renderCryptoItem = ({ item }: { item: typeof cryptoList[0] }) => (
    <TouchableOpacity
    onPress={() => router.push('/coinDetailsScreen')}
    style={[styles.cryptoItem, { backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF' }]}>
      <View style={styles.cryptoHeader}>
        <View style={styles.cryptoInfo}>
          <Text style={[styles.cryptoName, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
            {item.name}
          </Text>
          <Text style={[styles.cryptoSymbol, { color: isDark ? '#8E8E93' : '#666' }]}>
            {item.symbol}
          </Text>
        </View>
        <View style={styles.priceInfo}>
          <Text style={[styles.cryptoPrice, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
            {item.price}
          </Text>
          <Text style={[styles.cryptoChange, { color: item.changeColor }]}>
            {item.change24h}
          </Text>
        </View>
      </View>
      <View style={styles.cryptoStats}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: isDark ? '#8E8E93' : '#666' }]}>
            Market Cap
          </Text>
          <Text style={[styles.statValue, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
            {item.marketCap}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: isDark ? '#8E8E93' : '#666' }]}>
            Volume (24h)
          </Text>
          <Text style={[styles.statValue, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
            {item.volume}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000000' : '#F8F8F8' }]}>
      {/* <AppHeader onNotificationPress={handleNotificationPress} /> */}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Market Overview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
            Market Overview
          </Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF' }]}>
              <MaterialIcons name="trending-up" size={24} color="#4CAF50" />
              <Text style={[styles.statCardValue, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
                {marketStats.totalVolume}
              </Text>
              <Text style={[styles.statCardLabel, { color: isDark ? '#8E8E93' : '#666' }]}>
                Total Volume
              </Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF' }]}>
              <FontAwesome5 name="coins" size={20} color="#FF6B35" />
              <Text style={[styles.statCardValue, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
                {marketStats.totalMarketCap}
              </Text>
              <Text style={[styles.statCardLabel, { color: isDark ? '#8E8E93' : '#666' }]}>
                Market Cap
              </Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF' }]}>
              <MaterialIcons name="security" size={24} color="#2196F3" />
              <Text style={[styles.statCardValue, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
                {marketStats.activeCryptos}
              </Text>
              <Text style={[styles.statCardLabel, { color: isDark ? '#8E8E93' : '#666' }]}>
                Active Cryptos
              </Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF' }]}>
              <MaterialIcons name="rocket-launch" size={24} color="#9C27B0" />
              <Text style={[styles.statCardValue, { color: '#4CAF50' }]}>
                {marketStats.topGainer}
              </Text>
              <Text style={[styles.statCardLabel, { color: isDark ? '#8E8E93' : '#666' }]}>
                Top Gainer
              </Text>
            </View>
          </View>
        </View>

        {/* Trending Cryptos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
              Trending Cryptos
            </Text>
            <TouchableOpacity onPress={handleViewAllPress}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={cryptoList}
            renderItem={renderCryptoItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardValue: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  statCardLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  cryptoItem: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cryptoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cryptoInfo: {
    flex: 1,
  },
  cryptoName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  cryptoSymbol: {
    fontSize: 14,
    fontWeight: '500',
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  cryptoPrice: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  cryptoChange: {
    fontSize: 14,
    fontWeight: '600',
  },
  cryptoStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});