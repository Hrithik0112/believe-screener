import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-gifted-charts';
import { useColorScheme } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

// TypeScript interfaces
interface ChartDataPoint {
  value: number;
  label: string;
  date?: string;
}

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change24h: string;
  changeColor: string;
  marketCap: string;
  volume: string;
  rank: number;
}

interface MarketData {
  rank: string;
  circulatingSupply: string;
  totalSupply: string;
  maxSupply: string;
  allTimeHigh: string;
  allTimeLow: string;
  athDate: string;
  atlDate: string;
}

interface PriceHistoryItem {
  period: string;
  change: string;
  color: string;
}

type Timeframe = '1D' | '7D' | '1M' | '3M' | '1Y';

// Mock data with proper typing
const mockCoinData: CoinData = {
  id: 'bitcoin',
  name: 'Bitcoin',
  symbol: 'BTC',
  price: '$67,234.50',
  change24h: '+2.45%',
  changeColor: '#4CAF50',
  marketCap: '$1.32T',
  volume: '$28.5B',
  rank: 1,
};

const marketData: MarketData = {
  rank: '#1',
  circulatingSupply: '19,682,506 BTC',
  totalSupply: '21,000,000 BTC',
  maxSupply: '21,000,000 BTC',
  allTimeHigh: '$69,044.77',
  allTimeLow: '$67.81',
  athDate: 'Nov 10, 2021',
  atlDate: 'Jul 06, 2013',
};

const priceHistory: PriceHistoryItem[] = [
  { period: '1 Hour', change: '+0.42%', color: '#4CAF50' },
  { period: '24 Hours', change: '+2.45%', color: '#4CAF50' },
  { period: '7 Days', change: '-1.23%', color: '#F44336' },
  { period: '30 Days', change: '+8.67%', color: '#4CAF50' },
  { period: '1 Year', change: '+145.32%', color: '#4CAF50' },
];

// Chart data generator
const getChartDataForTimeframe = (timeframe: Timeframe): ChartDataPoint[] => {
  const baseData: Record<Timeframe, ChartDataPoint[]> = {
    '1D': [
      { value: 66800, label: '00:00' },
      { value: 66900, label: '04:00' },
      { value: 67100, label: '08:00' },
      { value: 67000, label: '12:00' },
      { value: 67234.50, label: '16:00' },
      { value: 67180, label: '20:00' },
      { value: 67234.50, label: 'Now' },
    ],
    '7D': [
      { value: 65000, label: 'Mon' },
      { value: 66200, label: 'Tue' },
      { value: 65800, label: 'Wed' },
      { value: 67100, label: 'Thu' },
      { value: 66900, label: 'Fri' },
      { value: 67000, label: 'Sat' },
      { value: 67234.50, label: 'Sun' },
    ],
    '1M': [
      { value: 62000, label: 'Week 1' },
      { value: 64500, label: 'Week 2' },
      { value: 66200, label: 'Week 3' },
      { value: 67234.50, label: 'Week 4' },
    ],
    '3M': [
      { value: 58000, label: 'Month 1' },
      { value: 62000, label: 'Month 2' },
      { value: 67234.50, label: 'Month 3' },
    ],
    '1Y': [
      { value: 45000, label: 'Q1' },
      { value: 52000, label: 'Q2' },
      { value: 48000, label: 'Q3' },
      { value: 67234.50, label: 'Q4' },
    ],
  };
  return baseData[timeframe] || baseData['1D'];
};

export default function CoinDetailsScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ coin?: any }>();
  console.log("params",params);
  const data = JSON.parse(params.coin);
  console.log("data",data);
  
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1D');
  
  const isDark = colorScheme === 'dark';
  const timeframes: Timeframe[] = ['1D', '7D', '1M', '3M', '1Y'];
  const currentChartData = getChartDataForTimeframe(selectedTimeframe);
  
  // In a real app, you would fetch coin data based on params.coinId
  const coin = mockCoinData;

  const handleBackPress = (): void => {
    router.back();
  };

  const renderTimeframeButton = (timeframe: Timeframe): React.JSX.Element => (
    <TouchableOpacity
      key={timeframe}
      style={[
        styles.timeframeButton,
        {
          backgroundColor: selectedTimeframe === timeframe 
            ? '#FF6B35' 
            : (isDark ? '#2C2C2E' : '#F0F0F0'),
        }
      ]}
      onPress={() => setSelectedTimeframe(timeframe)}
    >
      <Text
        style={[
          styles.timeframeText,
          {
            color: selectedTimeframe === timeframe 
              ? '#FFFFFF' 
              : (isDark ? '#FFFFFF' : '#666'),
          }
        ]}
      >
        {timeframe}
      </Text>
    </TouchableOpacity>
  );

  interface StatCardProps {
    title: string;
    value: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    iconColor: string;
  }

  const renderStatCard = ({ title, value, icon, iconColor }: StatCardProps) => (
    <View style={[styles.statCard, { backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF' }]}>
      <View style={styles.statCardHeader}>
        <MaterialIcons name={icon} size={20} color={iconColor} />
        <Text style={[styles.statCardTitle, { color: isDark ? '#8E8E93' : '#666' }]}>
          {title}
        </Text>
      </View>
      <Text style={[styles.statCardValue, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
        {value}
      </Text>
    </View>
  );

  const renderPriceHistoryItem = (): React.JSX.Element => (
    <>
    <View key={data.priceChange7d.period} style={styles.priceHistoryItem}>
      <Text style={[styles.priceHistoryPeriod, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
        24 Hours
      </Text>
      <Text style={[styles.priceHistoryChange, { color: data.priceChange24h.includes('+') ? '#00C851' : '#FF4444' }]}>
        {data.priceChange24h}
      </Text>
    </View>
    <View key={data.priceChange7d.period} style={styles.priceHistoryItem}>
    <Text style={[styles.priceHistoryPeriod, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
      7 Days
    </Text>
    <Text style={[styles.priceHistoryChange, { color: data.priceChange7d.includes('+') ? '#00C851' : '#FF4444' }]}>
      {data.priceChange7d}
    </Text>
  </View>
    </>
    
  );

  const formatYLabel = (value: number): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return `${value.toFixed(0)}`;
  };

  const pointerLabelComponent = (items: any[]) => {
    return (
      <View
        style={{
          height: 90,
          width: 100,
          justifyContent: 'center',
          marginTop: -30,
          marginLeft: -40,
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 14,
            marginBottom: 6,
            textAlign: 'center',
          }}
        >
          {items[0]?.date || items[0]?.label}
        </Text>
        <View
          style={{
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 16,
            backgroundColor: 'white',
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              textAlign: 'center',
              color: 'black',
            }}
          >
            ${items[0]?.value?.toFixed(2) || '0.00'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#F8F8F8' }]}>
      {/* Custom Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#FFFFFF' : '#1a1a1a'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
          {data.name}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Price Section */}
        <View style={styles.section}>
          <View style={styles.priceHeader}>
            <View>
              <Text style={[styles.currentPrice, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
                {data.formattedPrice}
              </Text>
              <View style={styles.priceChangeContainer}>
                <Text style={[styles.priceChange, { color: data.priceChange24h.includes('+') ? '#00C851' : '#FF4444' }]}>
                  {data.priceChange24h}
                </Text>
                <Text style={[styles.priceChangeLabel, { color: isDark ? '#8E8E93' : '#666' }]}>
                  (24h)
                </Text>
              </View>
            </View>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>
                #{data.rank}
              </Text>
            </View>
          </View>
        </View>

        {/* Chart Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
            Price Chart
          </Text>
          
          {/* Timeframe Selector */}
          <View style={styles.timeframeContainer}>
            {timeframes.map(renderTimeframeButton)}
          </View>

          {/* Chart */}
          <View style={[styles.chartContainer, { backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF' }]}>
            <LineChart
              data={currentChartData}
              width={screenWidth - 60}
              height={250}
              color="#4CAF50"
              thickness={3}
              startFillColor="rgba(76, 175, 80, 0.3)"
              endFillColor="rgba(76, 175, 80, 0.05)"
              startOpacity={0.9}
              endOpacity={0.2}
              initialSpacing={0}
              noOfSections={5}
              animateOnDataChange
              animationDuration={1000}
              onDataChangeAnimationDuration={300}
              areaChart
              yAxisColor={isDark ? '#444' : '#ddd'}
              xAxisColor={isDark ? '#444' : '#ddd'}
              yAxisTextStyle={{
                color: isDark ? '#8E8E93' : '#666',
                fontSize: 10,
              }}
              xAxisLabelTextStyle={{
                color: isDark ? '#8E8E93' : '#666',
                fontSize: 10,
              }}
              dataPointsColor="#4CAF50"
              dataPointsRadius={4}
              hideDataPoints={false}
              showVerticalLines
              verticalLinesColor={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
              rulesColor={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
              rulesType="solid"
              yAxisLabelPrefix="$"
              formatYLabel={(label: string) => formatYLabel(Number(label))}
              pointerConfig={{
                pointerStripHeight: 160,
                pointerStripColor: '#4CAF50',
                pointerStripWidth: 2,
                pointerColor: '#4CAF50',
                radius: 6,
                pointerLabelWidth: 100,
                pointerLabelHeight: 90,
                activatePointersOnLongPress: true,
                autoAdjustPointerLabelPosition: false,
                pointerLabelComponent,
              }}
            />
          </View>
        </View>

        {/* Market Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
            Market Statistics
          </Text>
          <View style={styles.statsGrid}>
            {renderStatCard({
              title: 'Market Cap',
              value: data.formattedMarketCap,
              icon: 'trending-up',
              iconColor: '#4CAF50'
            })}
            {renderStatCard({
              title: 'Volume (24h)',
              value: data.formattedVolume,
              icon: 'bar-chart',
              iconColor: '#FF6B35'
            })}
            
          </View>
        </View>

        {/* Price History */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
            Price Performance
          </Text>
          <View style={[styles.priceHistoryContainer, { backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF' }]}>
            {renderPriceHistoryItem()}
          </View>
        </View>

        {/* All-Time Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
            All-Time Statistics
          </Text>
          <View style={styles.allTimeStatsContainer}>
            <View style={[styles.allTimeStatCard, { backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF' }]}>
              <View style={styles.allTimeStatHeader}>
                <FontAwesome5 name="arrow-up" size={16} color="#4CAF50" />
                <Text style={[styles.allTimeStatLabel, { color: isDark ? '#8E8E93' : '#666' }]}>
                  All-Time High
                </Text>
              </View>
              <Text style={[styles.allTimeStatValue, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
                {marketData.allTimeHigh}
              </Text>
              <Text style={[styles.allTimeStatDate, { color: isDark ? '#8E8E93' : '#666' }]}>
                {marketData.athDate}
              </Text>
            </View>
            
            <View style={[styles.allTimeStatCard, { backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF' }]}>
              <View style={styles.allTimeStatHeader}>
                <FontAwesome5 name="arrow-down" size={16} color="#F44336" />
                <Text style={[styles.allTimeStatLabel, { color: isDark ? '#8E8E93' : '#666' }]}>
                  All-Time Low
                </Text>
              </View>
              <Text style={[styles.allTimeStatValue, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
                {marketData.allTimeLow}
              </Text>
              <Text style={[styles.allTimeStatDate, { color: isDark ? '#8E8E93' : '#666' }]}>
                {marketData.atlDate}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.buyButton]}
              onPress={() => {
                // Handle buy action
                console.log('Buy pressed');
              }}
            >
              <FontAwesome5 name="plus" size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Buy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.sellButton]}
              onPress={() => {
                // Handle sell action
                console.log('Sell pressed');
              }}
            >
              <FontAwesome5 name="minus" size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Sell</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.actionButton, 
                styles.watchButton, 
                { backgroundColor: isDark ? '#2C2C2E' : '#F0F0F0' }
              ]}
              onPress={() => {
                // Handle watch action
                console.log('Watch pressed');
              }}
            >
              <FontAwesome5 name="star" size={16} color="#FF6B35" />
              <Text style={[styles.watchButtonText, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
                Watch
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  currentPrice: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  priceChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceChange: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  priceChangeLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  rankBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  timeframeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chartContainer: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statCardTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  statCardValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  priceHistoryContainer: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  priceHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  priceHistoryPeriod: {
    fontSize: 16,
    fontWeight: '500',
  },
  priceHistoryChange: {
    fontSize: 16,
    fontWeight: '600',
  },
  allTimeStatsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  allTimeStatCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  allTimeStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  allTimeStatLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  allTimeStatValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  allTimeStatDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  buyButton: {
    backgroundColor: '#4CAF50',
  },
  sellButton: {
    backgroundColor: '#F44336',
  },
  watchButton: {
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  watchButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});