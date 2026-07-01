const env = import.meta.env ?? {};
const API_URL =
  env.VITE_NEWS_API_URL ||
  "https://api.spaceflightnewsapi.net/v4/articles/";
const CACHE_TTL = 60_000;
const requestCache = new Map();

const PROJECT_TERMS = {
  SPCX: ["spacex", "starship", "falcon", "dragon"],
  TSLA: ["tesla", "elon musk"],
  NVDA: ["nvidia", "ai", "artificial intelligence"],
  AAPL: ["apple"],
  THYAO: ["turkish airlines", "türk hava yolları"],
  ASELS: ["aselsan", "defence", "defense"],
  TUPRS: ["tüpraş", "tupras", "energy"],
  KCHOL: ["koç holding", "koc holding"],
  BTC: ["bitcoin", "crypto"],
  ETH: ["ethereum", "crypto"],
  SOL: ["solana", "crypto"],
  XRP: ["xrp", "ripple", "crypto"],
};

const POSITIVE_WORDS = [
  "successful",
  "launch",
  "contract",
  "partnership",
  "approval",
  "revenue",
  "growth",
  "deal",
  "milestone",
  "expansion",
  "record",
  "profitable",
];

const NEGATIVE_WORDS = [
  "delay",
  "failure",
  "lawsuit",
  "investigation",
  "loss",
  "debt",
  "crash",
  "cancel",
  "risk",
  "warning",
  "decline",
  "bankruptcy",
];

const DEMO_ARTICLES = [
  {
    id: "demo-1",
    title: "SpaceX prepares the next Starship launch milestone",
    summary:
      "Teams are completing pre-launch checks as the program moves toward its next flight milestone.",
    source: "Pulse demo",
    url: "",
    publishedAt: "2026-06-30T14:30:00Z",
  },
  {
    id: "demo-2",
    title: "Commercial space partnerships continue to expand",
    summary:
      "New launch and satellite partnerships are supporting continued growth across the commercial space market.",
    source: "Pulse demo",
    url: "",
    publishedAt: "2026-06-29T09:15:00Z",
  },
  {
    id: "demo-3",
    title: "Launch providers face schedule and supply-chain risk",
    summary:
      "Industry operators are monitoring potential delay risks while maintaining their planned mission cadence.",
    source: "Pulse demo",
    url: "",
    publishedAt: "2026-06-28T16:45:00Z",
  },
];

export class NewsServiceError extends Error {
  constructor(message, { status, cause } = {}) {
    super(message, { cause });
    this.name = "NewsServiceError";
    this.status = status;
    this.code = "NEWS_FETCH_FAILED";
  }
}

function cleanText(value) {
  return String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(Math.round(Number(value) || 0), min), max);
}

function includesTerm(text, term) {
  return text.toLocaleLowerCase("en-US").includes(term.toLocaleLowerCase("en-US"));
}

function getMatches(text, terms) {
  return terms.filter((term) => includesTerm(text, term));
}

function getSentimentHint(text) {
  const positive = getMatches(text, POSITIVE_WORDS).length;
  const negative = getMatches(text, NEGATIVE_WORDS).length;

  if (positive > negative) return "positive";
  if (negative > positive) return "negative";
  return "neutral";
}

function getRelevanceScore({ title, summary, symbol }) {
  const symbolTerms = [
    cleanText(symbol).toLowerCase(),
    ...(PROJECT_TERMS[cleanText(symbol).toUpperCase()] || []),
  ].filter(Boolean);
  const titleMatches = getMatches(title, symbolTerms).length;
  const summaryMatches = getMatches(summary, symbolTerms).length;
  const keywordMatches = getMatches(
    `${title} ${summary}`,
    [...POSITIVE_WORDS, ...NEGATIVE_WORDS],
  ).length;

  return clamp(20 + titleMatches * 25 + summaryMatches * 12 + keywordMatches * 3);
}

function normalizeArticle(article, index, symbol) {
  const title = cleanText(article?.title || article?.headline);
  const summary = cleanText(
    article?.summary || article?.description || article?.content,
  );
  const sentimentHint = getSentimentHint(`${title} ${summary}`);
  const relevanceScore = getRelevanceScore({ title, summary, symbol });

  return {
    id:
      article?.id ||
      article?.uuid ||
      article?.url ||
      `${article?.published_at || "article"}-${index}`,
    title,
    summary: summary || "Bu haber için kısa özet bulunmuyor.",
    url: cleanText(article?.url || article?.link),
    source: cleanText(
      article?.news_site ||
        article?.source?.name ||
        article?.source ||
        article?.publisher,
    ) || "Bilinmeyen kaynak",
    publishedAt:
      article?.published_at ||
      article?.publishedAt ||
      article?.publishedDate ||
      article?.date ||
      null,
    imageUrl: cleanText(
      article?.image_url ||
        article?.imageUrl ||
        article?.urlToImage ||
        article?.image,
    ),
    sentimentHint,
    relevanceScore,
    // Existing cards can keep consuming these compatibility fields.
    sentiment: sentimentHint,
    impactScore: relevanceScore,
    importanceScore: relevanceScore,
    shortSummary: summary || "Bu haber için kısa özet bulunmuyor.",
    impactLabel:
      relevanceScore >= 70 ? "High" : relevanceScore >= 45 ? "Medium" : "Low",
  };
}

function getPayloadArticles(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.articles)) return payload.articles;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function getRequestUrl({ limit, searchTerm, symbol }) {
  const url = new URL(API_URL, globalThis.location?.origin || "http://localhost");
  const normalizedSymbol = cleanText(symbol).toUpperCase();
  const query =
    cleanText(searchTerm) ||
    PROJECT_TERMS[normalizedSymbol]?.[0] ||
    normalizedSymbol;

  url.searchParams.set("limit", String(limit));
  if (query) url.searchParams.set("search", query);
  return url;
}

function cloneNews(items) {
  return items.map((item) => ({ ...item }));
}

export function getDemoNews({ symbol } = {}) {
  return DEMO_ARTICLES.map((item, index) =>
    normalizeArticle(item, index, symbol || "SPCX"),
  ).sort((a, b) => b.relevanceScore - a.relevanceScore);
}

export async function getNews({
  limit = 10,
  searchTerm,
  symbol,
  signal,
} = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
  let url;
  try {
    url = getRequestUrl({ limit: safeLimit, searchTerm, symbol });
  } catch (error) {
    throw new NewsServiceError("Haber servisi adresi geçersiz.", {
      cause: error,
    });
  }
  const cacheKey = url.toString();
  const cached = requestCache.get(cacheKey);

  if (cached && Date.now() - cached.createdAt < CACHE_TTL) {
    return cloneNews(cached.data);
  }

  let response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") throw error;
    throw new NewsServiceError("Haber servisine ulaşılamadı.", { cause: error });
  }

  if (!response.ok) {
    throw new NewsServiceError(
      `Haber servisi ${response.status} durum kodunu döndürdü.`,
      { status: response.status },
    );
  }

  try {
    const payload = await response.json();
    const data = getPayloadArticles(payload)
      .map((article, index) => normalizeArticle(article, index, symbol))
      .filter((article) => article.title)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    requestCache.set(cacheKey, { createdAt: Date.now(), data });
    return cloneNews(data);
  } catch (error) {
    throw new NewsServiceError("Haber verisi okunamadı.", { cause: error });
  }
}
