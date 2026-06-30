import { MARKET_IDS } from "../data/markets.js";

const DEMO_METADATA = {
  lastUpdated: null,
  isLiveData: false,
  dataSource: "Demo data",
};

const marketSnapshots = {
  SPCX: {
    symbol: "SPCX",
    name: "SpaceX Intelligence",
    marketId: MARKET_IDS.US_STOCKS,
    price: 165.32,
    currency: "USD",
    change: 12.09,
    changePercent: 7.89,
    ...DEMO_METADATA,
  },
  TSLA: {
    symbol: "TSLA",
    name: "Tesla",
    marketId: MARKET_IDS.US_STOCKS,
    price: 323.63,
    currency: "USD",
    change: 4.72,
    changePercent: 1.48,
    ...DEMO_METADATA,
  },
  NVDA: {
    symbol: "NVDA",
    name: "NVIDIA",
    marketId: MARKET_IDS.US_STOCKS,
    price: 157.54,
    currency: "USD",
    change: 2.31,
    changePercent: 1.49,
    ...DEMO_METADATA,
  },
  AAPL: {
    symbol: "AAPL",
    name: "Apple",
    marketId: MARKET_IDS.US_STOCKS,
    price: 201.08,
    currency: "USD",
    change: -1.16,
    changePercent: -0.57,
    ...DEMO_METADATA,
  },
  THYAO: {
    symbol: "THYAO",
    name: "Türk Hava Yolları",
    marketId: MARKET_IDS.BIST,
    price: 267.5,
    currency: "TRY",
    change: 3.25,
    changePercent: 1.23,
    ...DEMO_METADATA,
  },
  ASELS: {
    symbol: "ASELS",
    name: "Aselsan",
    marketId: MARKET_IDS.BIST,
    price: 156.8,
    currency: "TRY",
    change: 2.15,
    changePercent: 1.39,
    ...DEMO_METADATA,
  },
  TUPRS: {
    symbol: "TUPRS",
    name: "Tüpraş",
    marketId: MARKET_IDS.BIST,
    price: 142.4,
    currency: "TRY",
    change: -0.85,
    changePercent: -0.59,
    ...DEMO_METADATA,
  },
  KCHOL: {
    symbol: "KCHOL",
    name: "Koç Holding",
    marketId: MARKET_IDS.BIST,
    price: 166.1,
    currency: "TRY",
    change: 2.1,
    changePercent: 1.28,
    ...DEMO_METADATA,
  },
  BTC: {
    symbol: "BTC",
    name: "Bitcoin",
    marketId: MARKET_IDS.CRYPTO,
    price: 106842.17,
    currency: "USD",
    change: 1284.32,
    changePercent: 1.22,
    ...DEMO_METADATA,
  },
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    marketId: MARKET_IDS.CRYPTO,
    price: 2448.61,
    currency: "USD",
    change: 38.45,
    changePercent: 1.6,
    ...DEMO_METADATA,
  },
  SOL: {
    symbol: "SOL",
    name: "Solana",
    marketId: MARKET_IDS.CRYPTO,
    price: 148.27,
    currency: "USD",
    change: -2.14,
    changePercent: -1.42,
    ...DEMO_METADATA,
  },
  XRP: {
    symbol: "XRP",
    name: "XRP",
    marketId: MARKET_IDS.CRYPTO,
    price: 2.18,
    currency: "USD",
    change: 0.06,
    changePercent: 2.83,
    ...DEMO_METADATA,
  },
};

export function getMarketSnapshot(symbol, marketId) {
  const normalizedSymbol = symbol?.trim().toUpperCase();
  const snapshot = marketSnapshots[normalizedSymbol];

  if (!snapshot || (marketId && snapshot.marketId !== marketId)) {
    return null;
  }

  return { ...snapshot };
}
