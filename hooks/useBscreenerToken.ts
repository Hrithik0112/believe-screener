import { bscreenerTokenService } from '@/app/api/services/bscreenerTokenService';
import { useState, useEffect, useCallback } from 'react';

export const useBscreenerToken = (autoRefresh = false, refreshInterval = 30000) => {
  const [tokenData, setTokenData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTokenData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bscreenerTokenService.getTokenSummary();
      setTokenData(data);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTokenData();

    if (autoRefresh) {
      const interval = setInterval(fetchTokenData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchTokenData, autoRefresh, refreshInterval]);

  return {
    tokenData,
    loading,
    error,
    refetch: fetchTokenData,
    lastUpdated
  };
};