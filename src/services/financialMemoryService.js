import historicalEvents from "../data/historicalEvents.js";

const MIN_SIMILAR_EVENTS = 2;

const EVENT_TYPE_RULES = [
  {
    eventType: "lawsuit",
    keywords: ["lawsuit", "legal action", "court", "sued", "dava"],
  },
  {
    eventType: "delay",
    keywords: ["delay", "delayed", "postponed", "gecikme", "ertelendi"],
  },
  {
    eventType: "regulation",
    keywords: [
      "regulation",
      "regulator",
      "approval",
      "approved",
      "sec",
      "faa",
      "düzenleme",
      "onay",
    ],
  },
  {
    eventType: "contract",
    keywords: [
      "contract",
      "agreement",
      "deal",
      "award",
      "sözleşme",
      "anlaşma",
      "ihale",
    ],
  },
  {
    eventType: "partnership",
    keywords: [
      "partnership",
      "partner",
      "collaboration",
      "ortaklık",
      "iş birliği",
    ],
  },
  {
    eventType: "earnings",
    keywords: [
      "earnings",
      "revenue",
      "profit",
      "margin",
      "quarter",
      "bilanço",
      "gelir",
      "kâr",
      "kar",
    ],
  },
  {
    eventType: "launch",
    keywords: [
      "launch",
      "liftoff",
      "rocket",
      "mission",
      "fırlatma",
      "roket",
    ],
  },
  {
    eventType: "expansion",
    keywords: [
      "expansion",
      "growth",
      "capacity",
      "new market",
      "genişleme",
      "büyüme",
      "kapasite",
    ],
  },
  {
    eventType: "product",
    keywords: [
      "product",
      "unveiled",
      "release",
      "model",
      "device",
      "ürün",
      "tanıttı",
      "lansman",
    ],
  },
];

const LEGACY_EVENT_TYPE_MAP = {
  nasa_contract: "contract",
  starship_test: "launch",
  launch_success: "launch",
};

function normalizeText(value) {
  return String(value || "")
    .toLocaleLowerCase("en-US")
    .replace(/\s+/g, " ")
    .trim();
}

function roundReaction(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function getAverage(events, field) {
  const total = events.reduce(
    (sum, event) => sum + Number(event[field] || 0),
    0,
  );

  return roundReaction(total / events.length);
}

function formatReaction(value) {
  const sign = value > 0 ? "+" : "";
  const formatted = Number(value).toLocaleString("tr-TR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });

  return `${sign}${formatted}%`;
}

function estimateEventType(article) {
  const text = normalizeText(
    `${article.title || ""} ${article.shortSummary || article.summary || article.description || ""}`,
  );
  const rankedRules = EVENT_TYPE_RULES.map((rule, index) => ({
    ...rule,
    index,
    matchCount: rule.keywords.filter((keyword) =>
      text.includes(normalizeText(keyword)),
    ).length,
  }))
    .filter((rule) => rule.matchCount > 0)
    .sort(
      (first, second) =>
        second.matchCount - first.matchCount || first.index - second.index,
    );

  if (rankedRules.length) return rankedRules[0].eventType;

  return LEGACY_EVENT_TYPE_MAP[article.eventType] || null;
}

function createEmptyResult(eventType, similarEvents = []) {
  return {
    eventType,
    totalSimilarEvents: similarEvents.length,
    averageReaction1D: null,
    averageReaction3D: null,
    averageReaction7D: null,
    averageReaction1DLabel: null,
    averageReaction3DLabel: null,
    averageReaction7DLabel: null,
    positiveRate: null,
    negativeRate: null,
    bestCase: null,
    worstCase: null,
    similarEvents: similarEvents.map((event) => ({ ...event })),
    insufficientData: true,
  };
}

export function findSimilarHistoricalEvents(article, symbol, marketId) {
  const eventType = estimateEventType(article || {});
  const normalizedSymbol = String(symbol || "").trim().toUpperCase();
  const similarEvents = historicalEvents.filter(
    (event) =>
      event.symbol === normalizedSymbol &&
      event.marketId === marketId &&
      event.eventType === eventType,
  );

  if (!eventType || similarEvents.length < MIN_SIMILAR_EVENTS) {
    return createEmptyResult(eventType, similarEvents);
  }

  const positiveEvents = similarEvents.filter(
    (event) => event.priceReaction7D > 0,
  );
  const negativeEvents = similarEvents.filter(
    (event) => event.priceReaction7D < 0,
  );
  const sortedBySevenDayReaction = [...similarEvents].sort(
    (first, second) =>
      second.priceReaction7D - first.priceReaction7D,
  );
  const averageReaction1D = getAverage(similarEvents, "priceReaction1D");
  const averageReaction3D = getAverage(similarEvents, "priceReaction3D");
  const averageReaction7D = getAverage(similarEvents, "priceReaction7D");

  return {
    eventType,
    totalSimilarEvents: similarEvents.length,
    averageReaction1D,
    averageReaction3D,
    averageReaction7D,
    averageReaction1DLabel: formatReaction(averageReaction1D),
    averageReaction3DLabel: formatReaction(averageReaction3D),
    averageReaction7DLabel: formatReaction(averageReaction7D),
    positiveRate: Math.round(
      (positiveEvents.length / similarEvents.length) * 100,
    ),
    negativeRate: Math.round(
      (negativeEvents.length / similarEvents.length) * 100,
    ),
    bestCase: { ...sortedBySevenDayReaction[0] },
    worstCase: {
      ...sortedBySevenDayReaction[sortedBySevenDayReaction.length - 1],
    },
    similarEvents: similarEvents.map((event) => ({ ...event })),
    insufficientData: false,
  };
}
