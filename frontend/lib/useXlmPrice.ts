import { useEffect, useState } from 'react';

export const DEFAULT_XLM_USD_RATE = 0.207;

export function convertXlmToUsd(xlmAmount: number, rate = DEFAULT_XLM_USD_RATE): string {
  const usd = (xlmAmount * rate).toFixed(2);
  return `~$${usd} USD`;
}

export function useXlmPrice() {
  const [rate, setRate] = useState<number>(DEFAULT_XLM_USD_RATE);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchRate() {
      try {
        const res = await fetch('https://api.coinbase.com/v2/prices/XLM-USD/spot');
        const data = await res.json();
        const price = parseFloat(data?.data?.amount);
        if (isMounted && price && !isNaN(price)) {
          setRate(price);
        }
      } catch {
        try {
          const res2 = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd');
          const data2 = await res2.json();
          const price2 = data2?.stellar?.usd;
          if (isMounted && price2 && !isNaN(price2)) {
            setRate(price2);
          }
        } catch {}
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchRate();
    const interval = setInterval(fetchRate, 60000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  const formatPrice = (xlm: number, priceType?: 'fixed' | 'hour') => {
    const usd = (xlm * rate).toFixed(2);
    const suffix = priceType === 'hour' ? ' / h' : '';
    return {
      xlm: `${xlm} XLM${suffix}`,
      usd: `~$${usd} USD${suffix}`,
      full: `${xlm} XLM${suffix} (~$${usd} USD${suffix})`
    };
  };

  return { rate, loading, formatPrice, convertXlmToUsd: (xlm: number) => convertXlmToUsd(xlm, rate) };
}
