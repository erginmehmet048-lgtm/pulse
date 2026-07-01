const env = import.meta.env ?? {};
const FINNHUB_API_KEY = String(env.VITE_FINNHUB_API_KEY || "").trim();
const DEMO_SNAPSHOTS = {
  SPCX: { price: 165.32, change: 12.09, changePercent: 7.89, high: 169.4, low: 151.7, open: 154.1, previousClose: 153.23 },
  TSLA: { price: 323.63, change: 4.72, changePercent: 1.48, high: 326.9, low: 315.2, open: 318.4, previousClose: 318.91 },
  NVDA: { price: 157.54, change: 2.31, changePercent: 1.49, high: 159.2, low: 153.8, open: 154.6, previousClose: 155.23 },
  AAPL: { price: 201.08, change: -1.16, changePercent: -0.57, high: 203.5, low: 199.9, open: 202.7, previousClose: 202.24 },
  THYAO: { price: 267.5, change: 3.25, changePercent: 1.23, high: 270.1, low: 263.4, open: 264.2, previousClose: 264.25 },
  ASELS: { price: 156.8, change: 2.15, changePercent: 1.39, high: 158.2, low: 153.5, open: 154.1, previousClose: 154.65 },
  TUPRS: { price: 142.4, change: -0.85, changePercent: -0.59, high: 144.3, low: 141.8, open: 143.7, previousClose: 143.25 },
  KCHOL: { price: 166.1, change: 2.1, changePercent: 1.28, high: 167.4, low: 163.2, open: 164.0, previousClose: 164.0 },
  BTC: { price: 106842.17, change: 1284.32, changePercent: 1.22, high: 108120, low: 104980, open: 105520, previousClose: 105557.85 },
  ETH: { price: 2448.61, change: 38.45, changePercent: 1.6, high: 2482.4, low: 2398.2, open: 2410.3, previousClose: 2410.16 },
  SOL: { price: 148.27, change: -2.14, changePercent: -1.42, high: 152.7, low: 146.9, open: 150.5, previousClose: 150.41 },
  XRP: { price: 2.18, change: 0.06, changePercent: 2.83, high: 2.22, low: 2.1, open: 2.12, previousClose: 2.12 },
};

function numberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function getDemoSnapshot(symbol, errorMessage = "") {
  const data = DEMO_SNAPSHOTS[symbol] || {};
  return {
    symbol,
    price: numberOrNull(data.price),
    change: numberOrNull(data.change),
    changePercent: numberOrNull(data.changePercent),
    high: numberOrNull(data.high),
    low: numberOrNull(data.low),
    open: numberOrNull(data.open),
    previousClose: numberOrNull(data.previousClose),
    updatedAt: new Date().toISOString(),
    provider: "demo",
    isLive: false,
    errorMessage,
  };
}

function normalizeFinnhubQuote(symbol, quote) {
  const price = numberOrNull(quote?.c);
  if (!price || price <= 0) return null;

  return {
    symbol,
    price,
    change: numberOrNull(quote?.d),
    changePercent: numberOrNull(quote?.dp),
    high: numberOrNull(quote?.h),
    low: numberOrNull(quote?.l),
    open: numberOrNull(quote?.o),
    previousClose: numberOrNull(quote?.pc),
    updatedAt: quote?.t
      ? new Date(Number(quote.t) * 1000).toISOString()
      : new Date().toISOString(),
    provider: "finnhub",
    isLive: true,
    errorMessage: "",
  };
}

export async function getMarketSnapshot(symbol) {
  const normalizedSymbol = String(symbol || "").trim().toUpperCase();
  if (!normalizedSymbol) return getDemoSnapshot("");

  if (!FINNHUB_API_KEY) {
    return getDemoSnapshot(normalizedSymbol);
  }

  try {
    const url = new URL("https://finnhub.io/api/v1/quote");
    url.searchParams.set("symbol", normalizedSymbol);
    url.searchParams.set("token", FINNHUB_API_KEY);
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const liveSnapshot = normalizeFinnhubQuote(
      normalizedSymbol,
      await response.json(),
    );
    if (!liveSnapshot) throw new Error("Geçerli fiyat dönmedi");
    return liveSnapshot;
  } catch (error) {
    console.warn("Canlı piyasa verisi alınamadı; demo veriye geçildi.", error);
    return getDemoSnapshot(
      normalizedSymbol,
      "Canlı piyasa verisi alınamadı, demo veri gösteriliyor.",
    );
  }
}
