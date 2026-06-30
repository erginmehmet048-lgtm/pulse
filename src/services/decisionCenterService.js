import { findSimilarHistoricalEvents } from "./financialMemoryService.js";

const DECISION_LABELS = {
  strongPositive: "Strong Positive",
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
  strongNegative: "Strong Negative",
  insufficient: "Insufficient Data",
};

function clampScore(value) {
  const score = Number(value);

  return Number.isFinite(score)
    ? Math.min(Math.max(Math.round(score), 0), 100)
    : 0;
}

function getAverageScore(items, field) {
  if (!items.length) return null;

  const total = items.reduce(
    (sum, item) => sum + clampScore(item[field]),
    0,
  );

  return Math.round(total / items.length);
}

function getPublishedTime(value) {
  const time = new Date(value).getTime();

  return Number.isFinite(time) ? time : 0;
}

function getNewsCounts(news) {
  return news.reduce(
    (counts, item) => {
      const sentiment = String(item.sentiment || "neutral").toLowerCase();

      counts.total += 1;
      if (sentiment === "positive") counts.positive += 1;
      else if (sentiment === "negative") counts.negative += 1;
      else counts.neutral += 1;

      if (item.impactLabel === "High") counts.highImpact += 1;

      return counts;
    },
    {
      total: 0,
      positive: 0,
      neutral: 0,
      negative: 0,
      highImpact: 0,
    },
  );
}

function getOverallSentiment(counts) {
  if (
    counts.positive > counts.negative &&
    counts.positive >= counts.neutral
  ) {
    return "positive";
  }

  if (
    counts.negative > counts.positive &&
    counts.negative >= counts.neutral
  ) {
    return "negative";
  }

  return "neutral";
}

function getRiskLevel(news, counts, averageConfidence, overallSentiment) {
  if (!counts.total) return "Insufficient Data";

  const highImpactNegativeCount = news.filter(
    (item) =>
      item.sentiment === "negative" && item.impactLabel === "High",
  ).length;
  const negativeRatio = counts.negative / counts.total;

  if (
    highImpactNegativeCount > 0 ||
    negativeRatio >= 0.35 ||
    overallSentiment === "negative"
  ) {
    return "High";
  }

  if (
    counts.negative > 0 ||
    overallSentiment === "neutral" ||
    averageConfidence < 65
  ) {
    return "Medium";
  }

  return "Low";
}

function sortNews(news) {
  return [...news].sort(
    (first, second) =>
      clampScore(second.importanceScore) -
        clampScore(first.importanceScore) ||
      getPublishedTime(second.publishedAt) -
        getPublishedTime(first.publishedAt),
  );
}

function getFirstSentence(value) {
  const text = String(value || "Özet bilgisi bulunmuyor.")
    .replace(/\s+/g, " ")
    .trim();
  const abbreviationToken = "__PULSE_DOT__";
  const protectedText = text.replace(
    /\b(?:[a-z]\.){2,}/gi,
    (abbreviation) => abbreviation.replaceAll(".", abbreviationToken),
  );
  const firstSentence =
    protectedText.split(/(?<=[.!?…])\s+(?=[A-Z0-9])/)[0] || protectedText;
  const restored = firstSentence.replaceAll(abbreviationToken, ".");

  return restored.length > 180
    ? `${restored.slice(0, 180).trim()}…`
    : restored;
}

function getTopNews(sortedNews) {
  return sortedNews.slice(0, 3).map((item) => ({
    id: item.id,
    title: item.title,
    url: item.url,
    sentiment: item.sentiment,
    impactLabel: item.impactLabel,
    importanceScore: clampScore(item.importanceScore),
    summary: getFirstSentence(
      item.shortSummary ||
        item.originalSummary ||
        item.summary ||
        item.description,
    ),
  }));
}

function addHistoricalMemory(news, symbol, marketId) {
  return news.map((item) => ({
    ...item,
    historicalMemory: findSimilarHistoricalEvents(
      item,
      symbol,
      marketId,
    ),
  }));
}

function getHistoricalSignal(averageReaction7D) {
  if (averageReaction7D >= 5) return "Strong Positive";
  if (averageReaction7D >= 1.5) return "Weak Positive";
  if (averageReaction7D > -1.5) return "Neutral";
  if (averageReaction7D > -5) return "Weak Negative";

  return "Strong Negative";
}

function formatSignedPercentage(value) {
  const sign = value > 0 ? "+" : "";
  const formatted = Number(value).toLocaleString("tr-TR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });

  return `${sign}${formatted}%`;
}

function getHistoricalMetrics(news) {
  const sufficientMemories = news
    .map((item) => item.historicalMemory)
    .filter((memory) => !memory.insufficientData);
  const uniqueEvents = Array.from(
    new Map(
      sufficientMemories
        .flatMap((memory) => memory.similarEvents)
        .map((event) => [event.id, event]),
    ).values(),
  );

  if (!uniqueEvents.length) {
    return {
      historicalSignal: "Insufficient Data",
      historicalAverageReaction7D: null,
      similarEventsCount: 0,
      positiveReactionRate: null,
      historicalSummary: {
        insufficientData: true,
        totalSimilarEvents: 0,
        averageReaction7DLabel: "Veri yetersiz",
        positiveRateLabel: "Veri yetersiz",
      },
    };
  }

  const averageReaction7D =
    uniqueEvents.reduce(
      (sum, event) => sum + event.priceReaction7D,
      0,
    ) / uniqueEvents.length;
  const positiveEvents = uniqueEvents.filter(
    (event) => event.priceReaction7D > 0,
  ).length;
  const roundedAverage =
    Math.round((averageReaction7D + Number.EPSILON) * 100) / 100;
  const positiveRate = Math.round(
    (positiveEvents / uniqueEvents.length) * 100,
  );

  return {
    historicalSignal: getHistoricalSignal(averageReaction7D),
    historicalAverageReaction7D: roundedAverage,
    similarEventsCount: uniqueEvents.length,
    positiveReactionRate: positiveRate,
    historicalSummary: {
      insufficientData: false,
      totalSimilarEvents: uniqueEvents.length,
      averageReaction7DLabel: formatSignedPercentage(roundedAverage),
      positiveRateLabel: `%${positiveRate}`,
    },
  };
}

function getDecisionLabel(aiImpactScore, sentiment, historicalSignal) {
  if (aiImpactScore === null) return DECISION_LABELS.insufficient;

  if (sentiment === "positive") {
    return aiImpactScore >= 70
      ? DECISION_LABELS.strongPositive
      : DECISION_LABELS.positive;
  }

  if (sentiment === "negative") {
    return aiImpactScore >= 70
      ? DECISION_LABELS.strongNegative
      : DECISION_LABELS.negative;
  }

  if (aiImpactScore >= 55 && historicalSignal === "Strong Positive") {
    return DECISION_LABELS.positive;
  }

  if (aiImpactScore >= 55 && historicalSignal === "Strong Negative") {
    return DECISION_LABELS.negative;
  }

  return DECISION_LABELS.neutral;
}

function getDecisionSentence({
  aiImpactScore,
  historicalSignal,
  overallSentiment,
  riskLevel,
}) {
  if (aiImpactScore === null) {
    return "Karar üretmek için yeterli haber verisi yok.";
  }

  const sentimentLabels = {
    positive: "pozitif",
    neutral: "nötr",
    negative: "negatif",
  };
  const riskLabels = {
    Low: "düşük",
    Medium: "orta",
    High: "yüksek",
  };
  const historicalLabels = {
    "Strong Positive": "güçlü pozitif",
    "Weak Positive": "zayıf pozitif",
    Neutral: "nötr",
    "Weak Negative": "zayıf negatif",
    "Strong Negative": "güçlü negatif",
    "Insufficient Data": "veri yetersiz",
  };

  return `Haber akışı ${sentimentLabels[overallSentiment]}, risk seviyesi ${riskLabels[riskLevel]} ve tarihsel sinyal ${historicalLabels[historicalSignal]}.`;
}

export function generateDecisionSummary(news = [], symbol, marketId) {
  const normalizedNews = Array.isArray(news) ? news : [];
  const sortedNews = sortNews(
    addHistoricalMemory(normalizedNews, symbol, marketId),
  );
  const newsCounts = getNewsCounts(sortedNews);
  const aiImpactScore = getAverageScore(sortedNews, "importanceScore");
  const averageConfidence = getAverageScore(sortedNews, "confidence");
  const overallSentiment = getOverallSentiment(newsCounts);
  const riskLevel = getRiskLevel(
    sortedNews,
    newsCounts,
    averageConfidence,
    overallSentiment,
  );
  const historicalMetrics = getHistoricalMetrics(sortedNews);
  const decisionLabel = getDecisionLabel(
    aiImpactScore,
    overallSentiment,
    historicalMetrics.historicalSignal,
  );

  return {
    news: sortedNews,
    aiImpactScore,
    averageConfidence,
    overallSentiment,
    riskLevel,
    decisionLabel,
    decisionSummary: getDecisionSentence({
      aiImpactScore,
      historicalSignal: historicalMetrics.historicalSignal,
      overallSentiment,
      riskLevel,
    }),
    newsCounts,
    topNews: getTopNews(sortedNews),
    ...historicalMetrics,
  };
}
