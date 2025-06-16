export const formatPrice = (price: number) => {
    if (price === null || price === undefined) return 'N/A';
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
  };
  
  export const formatMarketCap = (marketCap: number) => {
    if (marketCap === null || marketCap === undefined) return 'N/A';
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    if (marketCap >= 1e3) return `$${(marketCap / 1e3).toFixed(2)}K`;
    return `$${marketCap.toFixed(2)}`;
  };
  
  export const formatVolume = (volume: number) => {
    if (volume === null || volume === undefined) return 'N/A';
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`;
    return `$${volume.toFixed(2)}`;
  };

  
  export const formatLargeNumber = (num: number, decimals = 0) => {
    if (num === null || num === undefined) return 'N/A';
    
    // Adjust for token decimals if provided
    const adjustedNum = decimals > 0 ? num / Math.pow(10, decimals) : num;
    
    if (adjustedNum >= 1e12) return `${(adjustedNum / 1e12).toFixed(2)}T`;
    if (adjustedNum >= 1e9) return `${(adjustedNum / 1e9).toFixed(2)}B`;
    if (adjustedNum >= 1e6) return `${(adjustedNum / 1e6).toFixed(2)}M`;
    if (adjustedNum >= 1e3) return `${(adjustedNum / 1e3).toFixed(2)}K`;
    return adjustedNum.toFixed(2);
  };
  
  export const formatTokenAmount = (amount: number, decimals: number) => {
    const adjustedAmount = amount / Math.pow(10, decimals);
    return formatLargeNumber(adjustedAmount);
  };

  export const formatPriceChange = (priceChange: number) => {
    if (priceChange === null || priceChange === undefined) return 'N/A';
    if (priceChange > 0) return `+${priceChange.toFixed(2)}%`;
    return `${priceChange.toFixed(2)}%`;
  };