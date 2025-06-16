import { useState, useEffect } from 'react';
import { bscreenerTokenService } from '@/app/api/services/bscreenerTokenService';

export const useBscreenerPrice = (updateInterval = 10000) => {
    const [priceData, setPriceData] = useState(null);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const unsubscribe = bscreenerTokenService.subscribeToPrice(
        (err: any, data: any) => {
          if (err) {
            setError(err.message);
          } else {
            setPriceData(data);
            setError(null);
          }
        },
        updateInterval
      );
  
      return unsubscribe;
    }, [updateInterval]);
  
    return { priceData, error };
};