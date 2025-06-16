import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import { useBelieveTokens } from '@/hooks/useBelieveTokens';

// Mock data - replace with real API data
const marketStats = {
  "24hVolume": "$56.20M",
  "totalMarketCap": "$302.40M",
  "coinLaunched": "40,544",
  "liquidity": "$31.20M",
};



export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { tokens, loading, error, refetch } = useBelieveTokens(true, 30000);



  const router = useRouter();

  // const handleNotificationPress = () => {
  //   console.log('Notification pressed');
  // };

  const handleViewAllPress = () => {
    console.log('View all pressed');
    router.push({
      pathname: '/search',
    })
  };

  const renderCryptoItem = ({ item }: { item: any }) => (
    <TouchableOpacity
    onPress={() => router.push({
      pathname: '/coinDetailsScreen',
      params: {
        coin: JSON.stringify(item)
      }
    })}
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
            {item.formattedPrice}
          </Text>
          <Text style={[styles.cryptoChange, { color: item.changeColor }]}>
            {item.change24h}
          </Text>
        </View>
      </View>
      <View style={styles.cryptoStats}>
        <View>
          <Text style={[styles.statLabel, { color: isDark ? '#8E8E93' : '#666' }]}>
            Market Cap
          </Text>
          <Text style={[styles.statValue, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
            {item.formattedMarketCap}
          </Text>
        </View>
        <View>
          <Text style={[styles.statLabel, { color: isDark ? '#8E8E93' : '#666' }]}>
            Volume (24h)
          </Text>
          <Text style={[styles.statValue, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
            {item.formattedVolume}
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
                {marketStats["24hVolume"]}
              </Text>
              <Text style={[styles.statCardLabel, { color: isDark ? '#8E8E93' : '#666' }]}>
                24h Volume
              </Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF' }]}>
              <FontAwesome5 name="coins" size={20} color="#FF6B35" />
              <Text style={[styles.statCardValue, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
                {marketStats["totalMarketCap"]}
              </Text>
              <Text style={[styles.statCardLabel, { color: isDark ? '#8E8E93' : '#666' }]}>
                 Market Cap
              </Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF' }]}>
              <MaterialIcons name="rocket-launch" size={24} color="#2196F3" />
              <Text style={[styles.statCardValue, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
                {marketStats["coinLaunched"]}
              </Text>
              <Text style={[styles.statCardLabel, { color: isDark ? '#8E8E93' : '#666' }]}>
                Coins Launched
              </Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF' }]}>
              <FontAwesome5 name="money-bill-wave" size={24} color="#9C27B0" />
              <Text style={[styles.statCardValue, { color: '#4CAF50' }]}>
                {marketStats["liquidity"]}
              </Text>
              <Text style={[styles.statCardLabel, { color: isDark ? '#8E8E93' : '#666' }]}>
                Total Liquidity
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
          {
            loading ? <ActivityIndicator /> :

          <FlatList
            data={tokens.slice(0, 10)}
            renderItem={renderCryptoItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
          }
          {
            error && <Text>Error: {error}</Text>
          }
          
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