import { believeTokensService } from '@/app/api/services/believeTokensService';
import { useState, useEffect } from 'react';

export const useBelieveTokens = (autoRefresh = false, refreshInterval = 30000) => {
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTokens = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await believeTokensService.getFormattedTokens();
      setTokens(data);
      setLastUpdated(new Date() );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();

    if (autoRefresh) {
      const interval = setInterval(fetchTokens, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  return {
    tokens,
    loading,
    error,
    refetch: fetchTokens,
    lastUpdated
  };
};