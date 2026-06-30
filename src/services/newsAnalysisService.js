const SENTIMENT_KEYWORDS = {
  positive: [
    "launch",
    "contract",
    "partnership",
    "profit",
    "record",
    "growth",
    "approval",
    "expansion",
  ],
  negative: [
    "lawsuit",
    "delay",
    "failure",
    "bankruptcy",
    "investigation",
    "loss",
    "recall",
  ],
};

const SCORE_RULES = {
  baseImportance: 20,
  titleKeywordWeight: 25,
  bodyKeywordWeight: 12,
  baseConfidence: 52,
  evidenceConfidenceWeight: 8,
  sentimentMarginWeight: 5,
};

const IMPACT_THRESHOLDS = {
  high: 70,
  medium: 40,
};

const EVENT_RULES = [
  {
    eventType: "nasa_contract",
    keywords: ["nasa"],
  },
  {
    eventType: "starship_test",
    keywords: ["starship", "launch", "liftoff"],
  },
  {
    eventType: "launch_success",
    keywords: ["rocket lab"],
    relatedStocks: ["RKLB"],
  },
];

const STOCK_RULES = [
  { keywords: ["spacex"], symbols: ["SPCX"] },
  { keywords: ["rocket lab"], symbols: ["RKLB"] },
  { keywords: ["tesla"], symbols: ["TSLA"] },
  { keywords: ["nvidia"], symbols: ["NVDA"] },
  { keywords: ["apple"], symbols: ["AAPL"] },
  {
    keywords: ["turkish airlines", "türk hava yolları"],
    symbols: ["THYAO"],
  },
  { keywords: ["aselsan"], symbols: ["ASELS"] },
  { keywords: ["tüpraş", "tupras"], symbols: ["TUPRS"] },
  { keywords: ["koç holding", "koc holding"], symbols: ["KCHOL"] },
  { keywords: ["bitcoin"], symbols: ["BTC"] },
  { keywords: ["ethereum"], symbols: ["ETH"] },
  { keywords: ["solana"], symbols: ["SOL"] },
  { keywords: ["xrp", "ripple"], symbols: ["XRP"] },
];

function clampScore(value) {
  const score = Number(value);

  if (!Number.isFinite(score)) return null;
  return Math.min(Math.max(Math.round(score), 0), 100);
}

function normalizeText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function includesKeyword(text, keyword) {
  const pattern = new RegExp(`\\b${escapeRegExp(keyword)}\\w*\\b`, "i");

  return pattern.test(text);
}

function findMatches(text, keywords) {
  return keywords.filter((keyword) => includesKeyword(text, keyword));
}

function getSentiment(positiveMatches, negativeMatches) {
  if (positiveMatches.length > negativeMatches.length) return "positive";
  if (negativeMatches.length > positiveMatches.length) return "negative";

  return "neutral";
}

function getImpactLabel(importanceScore) {
  if (importanceScore === null) return null;
  if (importanceScore >= IMPACT_THRESHOLDS.high) return "High";
  if (importanceScore >= IMPACT_THRESHOLDS.medium) return "Medium";

  return "Low";
}

function createShortSummary(article) {
  const sourceText = normalizeText(
    article.summary || article.description || article.title,
  );

  if (!sourceText) return "Bu haber için kısa özet bulunmuyor.";

  const abbreviationToken = "__PULSE_DOT__";
  const protectedText = sourceText.replace(
    /\b(?:[a-z]\.){2,}/gi,
    (abbreviation) => abbreviation.replaceAll(".", abbreviationToken),
  );
  const sentences = protectedText.split(/(?<=[.!?…])\s+(?=[A-Z0-9])/);

  return sentences
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(" ")
    .replaceAll(abbreviationToken, ".");
}

function getMarketMetadata(text) {
  const eventRule = EVENT_RULES.find((rule) =>
    rule.keywords.some((keyword) => includesKeyword(text, keyword)),
  );
  const stockRule = STOCK_RULES.find((rule) =>
    rule.keywords.some((keyword) => includesKeyword(text, keyword)),
  );

  return {
    eventType: eventRule?.eventType || "general_news",
    relatedStocks: eventRule?.relatedStocks || stockRule?.symbols || [],
  };
}

export async function analyzeNews(article = {}) {
  const safeArticle =
    article && typeof article === "object" ? article : {};
  const title = normalizeText(safeArticle.title);
  const body = normalizeText(
    `${safeArticle.summary || ""} ${safeArticle.description || ""}`,
  );
  const fullText = normalizeText(`${title} ${body}`);

  if (!fullText) {
    return {
      sentiment: "neutral",
      importanceScore: null,
      confidence: null,
      shortSummary: createShortSummary(safeArticle),
      impactLabel: null,
      matchedKeywords: [],
      eventType: "general_news",
      relatedStocks: [],
    };
  }

  const positiveMatches = findMatches(
    fullText,
    SENTIMENT_KEYWORDS.positive,
  );
  const negativeMatches = findMatches(
    fullText,
    SENTIMENT_KEYWORDS.negative,
  );
  const allMatches = [...positiveMatches, ...negativeMatches];
  const titleMatches = allMatches.filter((keyword) =>
    includesKeyword(title, keyword),
  );
  const bodyOnlyMatches = allMatches.filter(
    (keyword) => !titleMatches.includes(keyword),
  );

  const importanceScore = clampScore(
    SCORE_RULES.baseImportance +
      titleMatches.length * SCORE_RULES.titleKeywordWeight +
      bodyOnlyMatches.length * SCORE_RULES.bodyKeywordWeight,
  );
  const sentiment = getSentiment(positiveMatches, negativeMatches);
  const sentimentMargin = Math.abs(
    positiveMatches.length - negativeMatches.length,
  );
  const confidence = clampScore(
    SCORE_RULES.baseConfidence +
      allMatches.length * SCORE_RULES.evidenceConfidenceWeight +
      sentimentMargin * SCORE_RULES.sentimentMarginWeight,
  );
  const marketMetadata = getMarketMetadata(fullText);

  return {
    sentiment,
    importanceScore,
    confidence,
    shortSummary: createShortSummary(safeArticle),
    impactLabel: getImpactLabel(importanceScore),
    matchedKeywords: allMatches,
    ...marketMetadata,
  };
}
