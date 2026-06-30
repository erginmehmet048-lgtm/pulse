import { analyzeNews } from "./newsAnalysisService.js";

const env = import.meta.env ?? {};
const DEFAULT_API_URL =
  "https://api.spaceflightnewsapi.net/v4/articles/";
const API_URL = env.VITE_NEWS_API_URL || DEFAULT_API_URL;
const DEFAULT_LIMIT = 20;
const MARKET_ALIASES = {
  US_STOCKS: ["US_STOCKS", "US", "NASDAQ", "NYSE"],
  BIST: ["BIST", "BIST100", "BORSA ISTANBUL", "IST"],
  CRYPTO: ["CRYPTO", "CRYPTOCURRENCY", "DIGITAL ASSET"],
};
const SYMBOL_MARKETS = {
  SPCX: "US_STOCKS",
  TSLA: "US_STOCKS",
  NVDA: "US_STOCKS",
  AAPL: "US_STOCKS",
  THYAO: "BIST",
  ASELS: "BIST",
  TUPRS: "BIST",
  KCHOL: "BIST",
  BTC: "CRYPTO",
  ETH: "CRYPTO",
  SOL: "CRYPTO",
  XRP: "CRYPTO",
};

function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        normalizeText(
          typeof item === "object"
            ? item.symbol || item.code || item.name || item.id
            : item,
        ),
      )
      .filter(Boolean);
  }

  return normalizeText(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getArticles(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.articles)) return payload.articles;
  if (Array.isArray(payload?.data)) return payload.data;

  return [];
}

function getRequestUrl({ limit, market, symbol }) {
  const baseUrl = globalThis.location?.origin || "http://localhost";
  const url = new URL(API_URL, baseUrl);
  const limitParam = env.VITE_NEWS_API_LIMIT_PARAM || "limit";
  const symbolParam =
    env.VITE_NEWS_API_SYMBOL_PARAM ||
    (API_URL === DEFAULT_API_URL ? "search" : "");
  const marketParam = env.VITE_NEWS_API_MARKET_PARAM;

  url.searchParams.set(limitParam, String(limit));
  if (symbolParam && symbol) {
    url.searchParams.set(symbolParam, symbol);
  }
  if (marketParam && market) {
    url.searchParams.set(marketParam, market);
  }

  return url;
}

function getRequestHeaders() {
  if (!env.VITE_NEWS_API_KEY) return {};

  return {
    [env.VITE_NEWS_API_KEY_HEADER || "Authorization"]:
      env.VITE_NEWS_API_KEY,
  };
}

function getArticleSymbols(article, analysis) {
  return normalizeList(
      article.symbols ||
      article.tickers ||
      article.symbol ||
      article.ticker ||
      article.relatedSymbols ||
      analysis.relatedStocks,
  ).map((symbol) => symbol.toUpperCase());
}

function getArticleMarkets(article, symbols) {
  const explicitMarkets = normalizeList(
    article.markets ||
      article.market ||
      article.marketId ||
      article.exchange,
  ).map((market) => market.toUpperCase());

  if (explicitMarkets.length) return explicitMarkets;

  return [
    ...new Set(symbols.map((symbol) => SYMBOL_MARKETS[symbol]).filter(Boolean)),
  ];
}

function matchesFilters(article, { market, symbol }) {
  const normalizedSymbol = normalizeText(symbol).toUpperCase();
  const normalizedMarket = normalizeText(market).toUpperCase();
  const acceptedMarkets = MARKET_ALIASES[normalizedMarket] || [
    normalizedMarket,
  ];

  if (
    normalizedSymbol &&
    !article.symbols.includes(normalizedSymbol)
  ) {
    return false;
  }

  if (
    normalizedMarket &&
    article.markets.length &&
    !article.markets.some((item) => acceptedMarkets.includes(item))
  ) {
    return false;
  }

  return true;
}

async function normalizeArticle(article, index) {
  const analysis = await analyzeNews(article);
  const symbols = getArticleSymbols(article, analysis);
  const markets = getArticleMarkets(article, symbols);
  const title = normalizeText(article.title || article.headline);
  const publishedAt =
    article.publishedAt ||
    article.published_at ||
    article.publishedDate ||
    article.date ||
    null;

  return {
    id: article.id || article.uuid || article.url || `${publishedAt}-${index}`,
    title,
    summary: analysis.shortSummary,
    shortSummary: analysis.shortSummary,
    originalSummary: normalizeText(
      article.summary || article.description || article.content,
    ),
    url: article.url || article.link || "",
    source:
      article.source?.name ||
      article.source ||
      article.news_site ||
      article.publisher ||
      "",
    publishedAt,
    imageUrl:
      article.imageUrl ||
      article.image_url ||
      article.urlToImage ||
      article.image ||
      "",
    symbols,
    markets,
    stock: symbols[0] || null,
    eventType: analysis.eventType || "general_news",
    importanceScore: analysis.importanceScore,
    impactScore: analysis.importanceScore,
    sentiment: analysis.sentiment,
    impactLabel: analysis.impactLabel,
    confidence: analysis.confidence,
    tags: analysis.matchedKeywords,
  };
}

export async function getNews({
  symbol,
  market,
  limit = DEFAULT_LIMIT,
  signal,
} = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || DEFAULT_LIMIT, 1), 100);

  try {
    const response = await fetch(
      getRequestUrl({
        limit: safeLimit,
        market: normalizeText(market),
        symbol: normalizeText(symbol),
      }),
      {
      headers: getRequestHeaders(),
      signal,
      },
    );

    if (!response.ok) return [];

    const payload = await response.json();
    const articles = getArticles(payload);
    const normalizedNews = await Promise.all(
      articles.map(normalizeArticle),
    );

    return normalizedNews.filter(
      (article) =>
        article.title && matchesFilters(article, { market, symbol }),
    );
  } catch (error) {
    if (error?.name !== "AbortError") {
      console.error("Haber verisi alınamadı.", error);
    }

    return [];
  }
}
