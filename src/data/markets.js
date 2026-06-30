export const MARKET_IDS = {
  US_STOCKS: "US_STOCKS",
  BIST: "BIST",
  CRYPTO: "CRYPTO",
};

export const MARKETS = [
  {
    id: MARKET_IDS.US_STOCKS,
    name: "ABD Hisseleri",
    description: "Nasdaq / NYSE",
    icon: "🇺🇸",
    defaultSymbols: ["SPCX", "TSLA", "NVDA", "AAPL"],
  },
  {
    id: MARKET_IDS.BIST,
    name: "Borsa İstanbul",
    description: "Borsa İstanbul",
    icon: "🇹🇷",
    defaultSymbols: ["THYAO", "ASELS", "TUPRS", "KCHOL"],
  },
  {
    id: MARKET_IDS.CRYPTO,
    name: "Kripto",
    description: "Dijital varlıklar",
    icon: "₿",
    defaultSymbols: ["BTC", "ETH", "SOL", "XRP"],
  },
];

export const DEFAULT_MARKET_ID = MARKET_IDS.US_STOCKS;

export function getMarketById(marketId) {
  return (
    MARKETS.find((market) => market.id === marketId) ??
    MARKETS.find((market) => market.id === DEFAULT_MARKET_ID)
  );
}
