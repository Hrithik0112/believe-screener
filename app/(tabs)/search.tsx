import { 
    View, 
    Text, 
    TextInput, 
    FlatList, 
    TouchableOpacity, 
    StyleSheet, 
    ActivityIndicator,
    Image,
    Alert
  } from 'react-native'
  import React, { useState, useEffect } from 'react'
import { router } from 'expo-router'
import { useBelieveTokens } from '@/hooks/useBelieveTokens'
  
  // Mock crypto data
  const mockCryptoData = [
    {
      id: '1',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: '$45,234.56',
      change: '+2.34%',
      changeValue: 2.34,
      marketCap: '$890.2B',
      image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
    },
    {
      id: '2',
      name: 'Ethereum',
      symbol: 'ETH',
      price: '$2,845.67',
      change: '-1.23%',
      changeValue: -1.23,
      marketCap: '$342.1B',
      image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    },
    {
      id: '3',
      name: 'Binance Coin',
      symbol: 'BNB',
      price: '$312.45',
      change: '+0.89%',
      changeValue: 0.89,
      marketCap: '$48.2B',
      image: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
    },
    {
      id: '4',
      name: 'Cardano',
      symbol: 'ADA',
      price: '$0.4567',
      change: '+3.45%',
      changeValue: 3.45,
      marketCap: '$15.8B',
      image: 'https://cryptologos.cc/logos/cardano-ada-logo.png'
    },
    {
      id: '5',
      name: 'Solana',
      symbol: 'SOL',
      price: '$89.34',
      change: '-2.67%',
      changeValue: -2.67,
      marketCap: '$38.7B',
      image: 'https://cryptologos.cc/logos/solana-sol-logo.png'
    },
    {
      id: '6',
      name: 'Polygon',
      symbol: 'MATIC',
      price: '$0.8934',
      change: '+1.56%',
      changeValue: 1.56,
      marketCap: '$8.2B',
      image: 'https://cryptologos.cc/logos/polygon-matic-logo.png'
    },
    {
      id: '7',
      name: 'Chainlink',
      symbol: 'LINK',
      price: '$12.67',
      change: '+4.23%',
      changeValue: 4.23,
      marketCap: '$7.1B',
      image: 'https://cryptologos.cc/logos/chainlink-link-logo.png'
    },
    {
      id: '8',
      name: 'Polkadot',
      symbol: 'DOT',
      price: '$5.89',
      change: '-0.78%',
      changeValue: -0.78,
      marketCap: '$6.8B',
      image: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png'
    }
  ]
  
  export default function Search() {
    const [cryptoData, setCryptoData] = useState<any[]>([])
    const [filteredData, setFilteredData] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState('')

    const { tokens, loading, error, refetch } = useBelieveTokens(true, 30000);

  useEffect(() => {
    setCryptoData(tokens)
    setFilteredData(tokens)
  }, [tokens])

  
    // Handle search functionality
    useEffect(() => {
      if (searchQuery.trim() === '') {
        setFilteredData(tokens)
      } else {
        const filtered = cryptoData.filter((coin: any) => 
          coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setFilteredData(filtered)
      }
    }, [searchQuery, cryptoData])
  
    // Handle coin card click
    // const handleCoinPress = (coin: any) => {
    //   Alert.alert(
    //     coin.name,
    //     `Price: ${coin.price}\nMarket Cap: ${coin.marketCap}\nChange: ${coin.change}`,
    //     [
    //       { text: 'View Details', onPress: () => console.log(`Navigate to ${coin.name} details`) },
    //       { text: 'Add to Watchlist', onPress: () => console.log(`Added ${coin.name} to watchlist`) },
    //       { text: 'Cancel', style: 'cancel' }
    //     ]
    //   )
    // }
  
    // Render individual coin card
    const renderCoinCard = ({ item }: { item: any }) => (
      <TouchableOpacity 
        style={styles.coinCard} 
        onPress={() => router.push({
          pathname: '/coinDetailsScreen',
          params: {
            coin: JSON.stringify(item)
          }
        })}
        activeOpacity={0.7}
      >
        <View style={styles.coinInfo}>
          <View style={styles.coinHeader}>
            <View style={styles.coinImageContainer}>
              <Image source={{ uri: item.image }} style={styles.coinImage} />
            </View>
            <View style={styles.coinDetails}>
              <Text style={styles.coinName}>{item.name}</Text>
              <Text style={styles.coinSymbol}>{item.symbol}</Text>
            </View>
          </View>
          <View style={styles.priceInfo}>
            <Text style={styles.coinPrice}>{item.price}</Text>
            <Text style={[
              styles.coinChange, 
              { color: item.priceChange24h.includes('+') ? '#00C851' : '#FF4444' }
            ]}>
              {item.priceChange24h}
            </Text>
            <Text style={styles.marketCap}>{item.formattedMarketCap}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  
    // Loading component
    const LoadingComponent = () => (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35"  />
        <Text style={styles.loadingText}>Loading cryptocurrencies...</Text>
      </View>
    )
  
    // Empty state component
    const EmptyComponent = () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No cryptocurrencies found</Text>
        <Text style={styles.emptySubtext}>Try adjusting your search terms</Text>
      </View>
    )
  
    if (loading) {
      return (
        <View style={styles.container}>
          <LoadingComponent  />
        </View>
      )
    }
  
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cryptocurrencies</Text>
          <Text style={styles.headerSubtitle}>Track your favorite coins</Text>
        </View>
  
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search cryptocurrencies..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View style={styles.searchIcon}>
            <Text style={styles.searchIconText}>🔍</Text>
          </View>
        </View>
  
        {/* Results count */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredData.length} coin{filteredData.length !== 1 ? 's' : ''} found
          </Text>
        </View>
  
        {/* Crypto List */}
        <FlatList
          data={filteredData}
          renderItem={renderCoinCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={EmptyComponent}
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
      paddingHorizontal: 20,
      paddingBottom: 20,
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
    searchContainer: {
      marginHorizontal: 20,
      marginBottom: 16,
      position: 'relative',
    },
    searchInput: {
      backgroundColor: '#FFFFFF',
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingRight: 40,
      borderRadius: 12,
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#E1E5E9',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    searchIcon: {
      position: 'absolute',
      right: 12,
      top: 12,
    },
    searchIconText: {
      fontSize: 18,
    },
    resultsContainer: {
      paddingHorizontal: 20,
      marginBottom: 12,
    },
    resultsText: {
      fontSize: 14,
      color: '#666',
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
    coinInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    coinHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    coinImageContainer: {
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
    priceInfo: {
      alignItems: 'flex-end',
    },
    coinPrice: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1A1A1A',
      marginBottom: 2,
    },
    coinChange: {
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 2,
    },
    marketCap: {
      fontSize: 12,
      color: '#999',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F8F9FA',
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: '#666',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 60,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#666',
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      color: '#999',
    },
    coinImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
  })