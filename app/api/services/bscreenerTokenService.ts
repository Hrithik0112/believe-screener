import { formatPrice, formatLargeNumber, formatTokenAmount } from '@/utils/utis';

const BSCREENER_TOKEN_ADDRESS = '4PYijC1Xas63cxdoYnUg7SQgcg23UgNNcPmvbj6KNUSz';
const TOKEN_NAME = 'BSCREENER';
const TOKEN_FULL_NAME = 'BelieveScreener';

// API endpoints
const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
const JUPITER_BASE = 'https://price.jup.ag/v6';
const SOLSCAN_BASE = 'https://public-api.solscan.io';
const DEX_SCREENER_BASE = 'https://api.dexscreener.com/latest';
const HELIUS_BASE = 'https://api.helius.xyz/v0';

export const bscreenerTokenService = {
  // Get comprehensive token details
  getTokenDetails: async () => {
    try {
      const [
        priceData,
        jupiterData,
        solscanData,
        dexScreenerData
      ] = await Promise.allSettled([
        bscreenerTokenService.getPriceData(),
        bscreenerTokenService.getJupiterPrice(),
        bscreenerTokenService.getSolscanData(),
        bscreenerTokenService.getDexScreenerData()
      ]);

      return {
        tokenAddress: BSCREENER_TOKEN_ADDRESS,
        name: TOKEN_FULL_NAME,
        symbol: TOKEN_NAME,
        price: priceData.status === 'fulfilled' ? priceData.value : null,
        jupiter: jupiterData.status === 'fulfilled' ? jupiterData.value : null,
        blockchain: solscanData.status === 'fulfilled' ? solscanData.value : null,
        trading: dexScreenerData.status === 'fulfilled' ? dexScreenerData.value : null,
        lastUpdated: new Date().toISOString(),
        errors: {
          price: priceData.status === 'rejected' ? priceData.reason.message : null,
          jupiter: jupiterData.status === 'rejected' ? jupiterData.reason.message : null,
          blockchain: solscanData.status === 'rejected' ? solscanData.reason.message : null,
          trading: dexScreenerData.status === 'rejected' ? dexScreenerData.reason.message : null,
        }
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch token details: ${error.message}`);
    }
  },

  // Get price data from multiple sources
  getPriceData: async () => {
    try {
      // Try CoinGecko first
      const response = await fetch(
        `${COINGECKO_BASE}/simple/token_price/solana?contract_addresses=${BSCREENER_TOKEN_ADDRESS}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      const tokenData = data[BSCREENER_TOKEN_ADDRESS.toLowerCase()];

      if (!tokenData) {
        throw new Error('Token not found in CoinGecko');
      }

      return {
        source: 'coingecko',
        price: tokenData.usd,
        marketCap: tokenData.usd_market_cap,
        volume24h: tokenData.usd_24h_vol,
        priceChange24h: tokenData.usd_24h_change,
        lastUpdated: new Date(tokenData.last_updated_at * 1000).toISOString(),
        formattedPrice: formatPrice(tokenData.usd),
        formattedMarketCap: formatLargeNumber(tokenData.usd_market_cap),
        formattedVolume: formatLargeNumber(tokenData.usd_24h_vol)
      };
    } catch (error: any) {
      throw new Error(`Price data fetch failed: ${error.message}`);
    }
  },

  // Get Jupiter aggregated price
  getJupiterPrice: async () => {
    try {
      const response = await fetch(
        `${JUPITER_BASE}/price?ids=${BSCREENER_TOKEN_ADDRESS}`
      );

      if (!response.ok) {
        throw new Error(`Jupiter API error: ${response.status}`);
      }

      const data = await response.json();
      const priceData = data.data[BSCREENER_TOKEN_ADDRESS];

      if (!priceData) {
        throw new Error('Token not found in Jupiter');
      }

      return {
        source: 'jupiter',
        price: priceData.price,
        mintSymbol: priceData.mintSymbol,
        vsToken: priceData.vsToken,
        vsTokenSymbol: priceData.vsTokenSymbol,
        formattedPrice: formatPrice(priceData.price)
      };
    } catch (error: any) {
      throw new Error(`Jupiter price fetch failed: ${error.message}`);
    }
  },

  // Get blockchain data from Solscan
  getSolscanData: async () => {
    try {
      const response = await fetch(
        `${SOLSCAN_BASE}/token/meta?tokenAddress=${BSCREENER_TOKEN_ADDRESS}`
      );

      if (!response.ok) {
        throw new Error(`Solscan API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        source: 'solscan',
        name: data.name,
        symbol: data.symbol,
        decimals: data.decimals,
        supply: data.supply,
        icon: data.icon,
        website: data.website,
        twitter: data.twitter,
        telegram: data.telegram,
        description: data.description,
        formattedSupply: formatLargeNumber(data.supply, data.decimals)
      };
    } catch (error: any) {
      throw new Error(`Solscan data fetch failed: ${error.message}`);
    }
  },

  // Get DEX trading data
  getDexScreenerData: async () => {
    try {
      const response = await fetch(
        `${DEX_SCREENER_BASE}/dex/tokens/${BSCREENER_TOKEN_ADDRESS}`
      );

      if (!response.ok) {
        throw new Error(`DexScreener API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.pairs || data.pairs.length === 0) {
        throw new Error('No trading pairs found');
      }

      // Get the most liquid pair
      const mainPair = data.pairs.reduce((prev: any, current: any) => 
        (prev.liquidity?.usd || 0) > (current.liquidity?.usd || 0) ? prev : current
      );

      return {
        source: 'dexscreener',
        pairs: data.pairs.map((pair: any) => ({
          dexId: pair.dexId,
          url: pair.url,
          chainId: pair.chainId,
          baseToken: pair.baseToken,
          quoteToken: pair.quoteToken,
          priceNative: pair.priceNative,
          priceUsd: pair.priceUsd,
          volume24h: pair.volume?.h24,
          volume6h: pair.volume?.h6,
          volume1h: pair.volume?.h1,
          priceChange24h: pair.priceChange?.h24,
          priceChange6h: pair.priceChange?.h6,
          priceChange1h: pair.priceChange?.h1,
          liquidity: pair.liquidity?.usd,
          marketCap: pair.marketCap,
          pairCreatedAt: pair.pairCreatedAt
        })),
        mainPair: {
          dex: mainPair.dexId,
          price: mainPair.priceUsd,
          volume24h: mainPair.volume?.h24,
          liquidity: mainPair.liquidity?.usd,
          priceChange24h: mainPair.priceChange?.h24,
          url: mainPair.url
        }
      };
    } catch (error: any) {
      throw new Error(`DexScreener data fetch failed: ${error.message}`);
    }
  },

  // Get token holders data
  getHoldersData: async () => {
    try {
      const response = await fetch(
        `${SOLSCAN_BASE}/token/holders?tokenAddress=${BSCREENER_TOKEN_ADDRESS}&offset=0&limit=100`
      );

      if (!response.ok) {
        throw new Error(`Holders API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        source: 'solscan',
        totalHolders: data.total,
        holders: data.data.map((holder: any) => ({
          address: holder.address,
          amount: holder.amount,
          decimals: holder.decimals,
          rank: holder.rank,
          percentage: ((holder.amount / data.totalSupply) * 100).toFixed(4)
        })),
        topHolders: data.data.slice(0, 10)
      };
    } catch (error: any) {
      throw new Error(`Holders data fetch failed: ${error.message}`);
    }
  },

  // Get transaction history
  getTransactionHistory: async (limit = 50) => {
    try {
      const response = await fetch(
        `${SOLSCAN_BASE}/token/transfer?tokenAddress=${BSCREENER_TOKEN_ADDRESS}&offset=0&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`Transaction API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        source: 'solscan',
        transactions: data.data.map((tx: any) => ({
          signature: tx.signature,
          blockTime: new Date(tx.blockTime * 1000).toISOString(),
          from: tx.from,
          to: tx.to,
          amount: tx.amount,
          decimals: tx.decimals,
          formattedAmount: formatTokenAmount(tx.amount, tx.decimals),
          status: tx.status
        }))
      };
    } catch (error: any) {
      throw new Error(`Transaction history fetch failed: ${error.message}`);
    }
  },

  // Get real-time price updates
  subscribeToPrice: (callback: any, interval = 10000) => {
    const fetchPrice = async () => {
      try {
        const priceData = await bscreenerTokenService.getPriceData();
        callback(null, priceData);
      } catch (error: any) {
        callback(error, null);
      }
    };

    fetchPrice(); // Initial fetch
    const intervalId = setInterval(fetchPrice, interval);

    return () => clearInterval(intervalId); // Cleanup function
  },

  // Get formatted summary for UI
  getTokenSummary: async () => {
    try {
      const details = await bscreenerTokenService.getTokenDetails();
      
      return {
        address: BSCREENER_TOKEN_ADDRESS,
        name: TOKEN_FULL_NAME,
        symbol: TOKEN_NAME,
        currentPrice: details.price?.price || null,
        formattedPrice: details.price?.formattedPrice || 'N/A',
        priceChange24h: details.price?.priceChange24h || null,
        marketCap: details.price?.marketCap || null,
        formattedMarketCap: details.price?.formattedMarketCap || 'N/A',
        volume24h: details.price?.volume24h || null,
        formattedVolume: details.price?.formattedVolume || 'N/A',
        supply: details.blockchain?.supply || null,
        formattedSupply: details.blockchain?.formattedSupply || 'N/A',
        decimals: details.blockchain?.decimals || null,
        mainDex: details.trading?.mainPair?.dex || 'Unknown',
        liquidity: details.trading?.mainPair?.liquidity || null,
        website: details.blockchain?.website || null,
        twitter: details.blockchain?.twitter || null,
        telegram: details.blockchain?.telegram || null,
        description: details.blockchain?.description || null,
        lastUpdated: details.lastUpdated,
        priceChangeColor: (details.price?.priceChange24h || 0) >= 0 ? '#00D4AA' : '#FF4747'
      };
    } catch (error: any) {
      throw new Error(`Summary fetch failed: ${error.message}`);
    }
  }
};