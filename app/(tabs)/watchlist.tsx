import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    StyleSheet, 
    Alert,
    Animated
  } from 'react-native'
  import React, { useState, useRef } from 'react'
  
  // Mock watchlist data with 2 coins
  const initialWatchlistData = [
    {
      id: '1',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: '$45,234.56',
      change: '+2.34%',
      changeValue: 2.34,
      marketCap: '$890.2B',
      priceData: [42000, 43500, 44200, 45234], // Simple price history
      volume: '$28.5B'
    },
    {
      id: '2',
      name: 'Ethereum',
      symbol: 'ETH',
      price: '$2,845.67',
      change: '-1.23%',
      changeValue: -1.23,
      marketCap: '$342.1B',
      priceData: [2900, 2850, 2820, 2845], // Simple price history
      volume: '$12.3B'
    }
  ]
  
  export default function Watchlist() {
    const [watchlistData, setWatchlistData] = useState(initialWatchlistData)
    const fadeAnim = useRef(new Animated.Value(1)).current
  
    // Handle coin press for details
    const handleCoinPress = (coin: any) => {
      Alert.alert(
        `${coin.name} Details`,
        `Price: ${coin.price}\nMarket Cap: ${coin.marketCap}\n24h Volume: ${coin.volume}\nChange: ${coin.change}`,
        [
          { text: 'View Chart', onPress: () => console.log(`View ${coin.name} chart`) },
          { text: 'Buy/Sell', onPress: () => console.log(`Trade ${coin.name}`) },
          { text: 'Close', style: 'cancel' }
        ]
      )
    }
  
    // Handle remove from watchlist
    const handleRemoveFromWatchlist = (coinId: any, coinName: any) => {
      Alert.alert(
        'Remove from Watchlist',
        `Are you sure you want to remove ${coinName} from your watchlist?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Remove', 
            style: 'destructive',
            onPress: () => {
              setWatchlistData(prev => prev.filter(coin => coin.id !== coinId))
            }
          }
        ]
      )
    }
  
    // Handle refresh
    const handleRefresh = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
  
      // Simulate price update
      setTimeout(() => {
        setWatchlistData(prev => prev.map(coin => ({
          ...coin,
          price: coin.symbol === 'BTC' ? '$45,456.78' : '$2,867.43',
          change: coin.symbol === 'BTC' ? '+2.84%' : '-0.87%',
          changeValue: coin.symbol === 'BTC' ? 2.84 : -0.87
        })))
      }, 300)
    }
  
    // Render simple price chart
    const renderMiniChart = (priceData: any, isPositive: any) => (
      <View style={styles.chartContainer}>
        {priceData.map((price: any, index: any) => (
          <View 
            key={index} 
            style={[
              styles.chartBar, 
              { 
                height: (price / Math.max(...priceData)) * 20,
                backgroundColor: isPositive ? '#00C851' : '#FF4444'
              }
            ]} 
          />
        ))}
      </View>
    )
  
    // Render individual coin card
    const renderWatchlistItem = ({ item }: { item: any }) => (
      <Animated.View style={[styles.coinCard, { opacity: fadeAnim }]}>
        <TouchableOpacity 
          onPress={() => handleCoinPress(item)}
          style={styles.coinContent}
          activeOpacity={0.7}
        >
          <View style={styles.coinHeader}>
            <View style={styles.coinInfo}>
              <View style={styles.coinIconContainer}>
                <Text style={styles.coinIcon}>{item.symbol.charAt(0)}</Text>
              </View>
              <View style={styles.coinDetails}>
                <Text style={styles.coinName}>{item.name}</Text>
                <Text style={styles.coinSymbol}>{item.symbol}</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              onPress={() => handleRemoveFromWatchlist(item.id, item.name)}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
  
          <View style={styles.priceSection}>
            <View style={styles.priceInfo}>
              <Text style={styles.coinPrice}>{item.price}</Text>
              <Text style={[
                styles.coinChange, 
                { color: item.changeValue >= 0 ? '#00C851' : '#FF4444' }
              ]}>
                {item.change}
              </Text>
            </View>
            
            {renderMiniChart(item.priceData, item.changeValue >= 0)}
          </View>
  
          <View style={styles.additionalInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Market Cap</Text>
              <Text style={styles.infoValue}>{item.marketCap}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Volume</Text>
              <Text style={styles.infoValue}>{item.volume}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  
    // Empty state component
    const EmptyWatchlist = () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📊</Text>
        <Text style={styles.emptyTitle}>Your Watchlist is Empty</Text>
        <Text style={styles.emptySubtitle}>Add coins to track their performance</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Cryptocurrencies</Text>
        </TouchableOpacity>
      </View>
    )
  
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Watchlist</Text>
            <Text style={styles.headerSubtitle}>
              {watchlistData.length} coin{watchlistData.length !== 1 ? 's' : ''} tracked
            </Text>
          </View>
          <TouchableOpacity 
            onPress={handleRefresh}
            style={styles.refreshButton}
          >
            <Text style={styles.refreshButtonText}>↻</Text>
          </TouchableOpacity>
        </View>
  
        {/* Portfolio Summary */}
        {watchlistData.length > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Portfolio Overview</Text>
            <View style={styles.summaryContent}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Value</Text>
                <Text style={styles.summaryValue}>$48,080.23</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>24h Change</Text>
                <Text style={[styles.summaryValue, { color: '#00C851' }]}>+$1,234.56</Text>
              </View>
            </View>
          </View>
        )}
  
        {/* Watchlist */}
        <FlatList
          data={watchlistData}
          renderItem={renderWatchlistItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={EmptyWatchlist}
        />
      </View>
    )
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA',
      paddingTop: 10,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    headerContent: {
      flex: 1,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#1A1A1A',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 16,
      color: '#666',
    },
    refreshButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#FF6B35',
      justifyContent: 'center',
      alignItems: 'center',
    },
    refreshButtonText: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: 'bold',
    },
    summaryCard: {
      backgroundColor: '#FFFFFF',
      marginHorizontal: 20,
      marginBottom: 20,
      padding: 16,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    summaryTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1A1A1A',
      marginBottom: 12,
    },
    summaryContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    summaryItem: {
      flex: 1,
    },
    summaryLabel: {
      fontSize: 14,
      color: '#666',
      marginBottom: 4,
    },
    summaryValue: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1A1A1A',
    },
    listContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    coinCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: '#F0F0F0',
    },
    coinContent: {
      flex: 1,
    },
    coinHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    coinInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    coinIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    coinIcon: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    coinDetails: {
      flex: 1,
    },
    coinName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1A1A1A',
      marginBottom: 2,
    },
    coinSymbol: {
      fontSize: 14,
      color: '#666',
    },
    removeButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#FF4444',
      justifyContent: 'center',
      alignItems: 'center',
    },
    removeButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    priceSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    priceInfo: {
      flex: 1,
    },
    coinPrice: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1A1A1A',
      marginBottom: 4,
    },
    coinChange: {
      fontSize: 14,
      fontWeight: '500',
    },
    chartContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      height: 20,
      width: 60,
    },
    chartBar: {
      width: 8,
      marginHorizontal: 1,
      borderRadius: 2,
    },
    additionalInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#F0F0F0',
    },
    infoItem: {
      flex: 1,
    },
    infoLabel: {
      fontSize: 12,
      color: '#999',
      marginBottom: 2,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: '500',
      color: '#1A1A1A',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 60,
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#1A1A1A',
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 14,
      color: '#666',
      marginBottom: 24,
      textAlign: 'center',
    },
    addButton: {
      backgroundColor: '#FF6B35',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  })