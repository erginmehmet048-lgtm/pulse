import { findSimilarHistoricalEvents } from "./financialMemoryService.js";

function clampScore(value) {
  const score = Number(value);

  return Number.isFinite(score)
    ? Math.min(Math.max(Math.round(score), 0), 100)
    : 0;
}

function getAverageScore(items, field) {
  if (!items.length) return 0;

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
  if (!counts.total) return "Medium";

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

function getWatchStatus(overallSentiment, riskLevel, averageImportance) {
  if (overallSentiment === "negative" || riskLevel === "High") {
    return "SELL/RISK WATCH";
  }

  if (overallSentiment === "positive" && averageImportance >= 45) {
    return "BUY WATCH";
  }

  return "NEUTRAL WATCH";
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

function getTopNews(sortedNews) {
  return sortedNews
    .slice(0, 3)
    .map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      sentiment: item.sentiment,
      impactLabel: item.impactLabel,
      importanceScore: clampScore(item.importanceScore),
      summary:
        item.shortSummary ||
        item.originalSummary ||
        item.summary ||
        "Özet bilgisi bulunmuyor.",
    }));
}

function compactTitle(title, maxLength = 90) {
  const compact = String(title || "Başlık bilgisi bulunmuyor")
    .replace(/[.!?]+/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return compact.length > maxLength
    ? `${compact.slice(0, maxLength).trim()}…`
    : compact;
}

function createExecutiveSummary({
  counts,
  overallSentiment,
  riskLevel,
  topNews,
}) {
  if (!counts.total) {
    return "Haber analizi hazırlanıyor. En önemli katalizör henüz belirlenmedi. Yeni veri gelene kadar temkinli izleme önerilir.";
  }

  const flowDescriptions = {
    positive: "genel olarak pozitif",
    neutral: "dengeli ve nötr",
    negative: "negatif baskının öne çıktığı",
  };
  const flowSentence = `Haber akışı ${counts.positive} pozitif, ${counts.neutral} nötr ve ${counts.negative} negatif sinyalle ${flowDescriptions[overallSentiment]} bir görünüm sunuyor.`;
  const primaryCatalyst = topNews[0];
  const catalystSentence = primaryCatalyst
    ? `En önemli katalizör, ${primaryCatalyst.importanceScore}/100 önem skoruyla “${compactTitle(primaryCatalyst.title)}” haberi.`
    : "En önemli katalizör henüz belirlenmedi.";
  const riskSentences = {
    Low: "Risk seviyesi düşük; yine de haber akışındaki yön değişimleri izlenmeli.",
    Medium:
      "Risk seviyesi orta; karışık sinyaller ve analiz güvenindeki değişimler yakından izlenmeli.",
    High: `Risk seviyesi yüksek; ${counts.negative} negatif haber ve yüksek etkili gelişmeler yakından izlenmeli.`,
  };

  return `${flowSentence} ${catalystSentence} ${riskSentences[riskLevel]}`;
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
      positiveReactionRate: 0,
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

  return {
    historicalSignal: getHistoricalSignal(averageReaction7D),
    historicalAverageReaction7D:
      Math.round((averageReaction7D + Number.EPSILON) * 100) / 100,
    similarEventsCount: uniqueEvents.length,
    positiveReactionRate: Math.round(
      (positiveEvents / uniqueEvents.length) * 100,
    ),
  };
}

export function generateDecisionSummary(news = [], symbol, marketId) {
  const normalizedNews = Array.isArray(news) ? news : [];
  const newsWithMemory = addHistoricalMemory(
    normalizedNews,
    symbol,
    marketId,
  );
  const sortedNews = sortNews(newsWithMemory);
  const newsCounts = getNewsCounts(sortedNews);
  const averageImportance = getAverageScore(
    sortedNews,
    "importanceScore",
  );
  const averageConfidence = getAverageScore(sortedNews, "confidence");
  const overallSentiment = getOverallSentiment(newsCounts);
  const riskLevel = getRiskLevel(
    sortedNews,
    newsCounts,
    averageConfidence,
    overallSentiment,
  );
  const topNews = getTopNews(sortedNews);
  const historicalMetrics = getHistoricalMetrics(sortedNews);

  return {
    news: sortedNews,
    averageImportance,
    averageConfidence,
    overallSentiment,
    riskLevel,
    newsCounts,
    topNews,
    executiveSummary: createExecutiveSummary({
      counts: newsCounts,
      overallSentiment,
      riskLevel,
      topNews,
    }),
    status: getWatchStatus(
      overallSentiment,
      riskLevel,
      averageImportance,
    ),
    importantNewsCount: newsCounts.highImpact,
    ...historicalMetrics,
  };
}
