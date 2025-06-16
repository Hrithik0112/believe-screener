import { formatPrice, formatMarketCap, formatVolume, formatPriceChange } from '@/utils/utis';


const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export const believeTokensService = {
  // Get all Believe ecosystem tokens
  getAllBelieveTokens: async (page = 1, perPage = 60) => {
    try {
      const response = await fetch(
        `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&category=believe-app-ecosystem&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=1h%2C24h%2C7d`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(`Failed to fetch Believe tokens: ${error.message}`);
    }
  },

  // Get trending Believe tokens
  getTrendingBelieveTokens: async () => {
    try {
      const allTokens = await believeTokensService.getAllBelieveTokens(1, 50);
      
      // Sort by 24h price change percentage
      return allTokens
        .filter((token: any) => token.price_change_percentage_24h !== null)
        .sort((a: any, b: any) => b.price_change_percentage_24h - a.price_change_percentage_24h)
        .slice(0, 10);
    } catch (error: any) {
      throw new Error(`Failed to fetch trending tokens: ${error.message}`);
    }
  },

  // Get specific token details
  getTokenDetails: async (tokenId: string) => {
    try {
      const response = await fetch(
        `${COINGECKO_BASE_URL}/coins/${tokenId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(`Failed to fetch token details: ${error.message}`);
    }
  },

  // Search Believe tokens
  searchBelieveTokens: async (query: string) => {
    try {
      const allTokens = await believeTokensService.getAllBelieveTokens(1, 250);
      
      return allTokens.filter((token: any) => 
        token.name.toLowerCase().includes(query.toLowerCase()) ||
        token.symbol.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error: any) {
      throw new Error(`Failed to search tokens: ${error.message}`);
    }
  },

  // Get tokens by market cap range
  getTokensByMarketCap: async (minMarketCap = 0, maxMarketCap = Infinity) => {
    try {
      const allTokens = await believeTokensService.getAllBelieveTokens(1, 250);
      
      return allTokens.filter((token: any) => 
        token.market_cap >= minMarketCap && 
        token.market_cap <= maxMarketCap
      );
    } catch (error: any) {
      throw new Error(`Failed to filter by market cap: ${error.message}`);
    }
  },

  // Get new tokens (launched recently)
  getNewTokens: async (daysOld = 7) => {
    try {
      const allTokens = await believeTokensService.getAllBelieveTokens(1, 250);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      return allTokens.filter((token: any) => {
        if (!token.atl_date) return false;
        const atlDate = new Date(token.atl_date);
        return atlDate >= cutoffDate;
      });
    } catch (error: any) {
      throw new Error(`Failed to fetch new tokens: ${error.message}`);
    }
  },

  // Get formatted token data for UI
  getFormattedTokens: async () => {
    try {
      const tokens = await believeTokensService.getAllBelieveTokens();
      
      return tokens.map((token: any) => ({
        id: token.id,
        name: token.name,
        symbol: token.symbol.toUpperCase(),
        image: token.image,
        currentPrice: token.current_price,
        marketCap: token.market_cap,
        volume24h: token.total_volume,
        priceChange24h: formatPriceChange(token.price_change_percentage_24h),
        priceChange7d: formatPriceChange(token.price_change_percentage_7d_in_currency),
        rank: token.market_cap_rank,
        lastUpdated: token.last_updated,
        // Custom formatting
        formattedPrice: formatPrice(token.current_price),
        formattedMarketCap: formatMarketCap(token.market_cap),
        formattedVolume: formatVolume(token.total_volume),
        priceChangeColor: token.price_change_percentage_24h >= 0 ? '#00D4AA' : '#FF4747'
      }));
    } catch (error: any) {
      throw new Error(`Failed to format tokens: ${error.message}`);
    }
  }
};