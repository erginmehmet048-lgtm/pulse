import { generateAIDecision } from "./aiDecisionEngine.js";
import { retrieveHistoricalMemory } from "./historicalMemoryService.js";

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
    protectedText.split(/(?<=[.!?…])\s+(?=[A-Z0-9])/)[0] ||
    protectedText;
  const restored = firstSentence.replaceAll(abbreviationToken, ".");

  return restored.length > 180
    ? `${restored.slice(0, 180).trim()}…`
    : restored;
}

function getTopNews(criticalNews) {
  return criticalNews.map((item) => ({
    id: item.id,
    title: item.title,
    url: item.url,
    sentiment: item.sentiment,
    impactLabel: item.impactLabel,
    impactScore: item.impactScore,
    importanceScore: item.impactScore,
    summary: getFirstSentence(
      item.shortSummary ||
        item.originalSummary ||
        item.summary ||
        item.description,
    ),
  }));
}

function addHistoricalMemory(news, historicalMemory) {
  return news.map((item) => ({
    ...item,
    historicalMemory,
  }));
}

export function generateDecisionSummary(news = [], symbol, marketId) {
  const historicalMemory = retrieveHistoricalMemory({
    symbol,
    marketId,
  });
  const aiDecision = generateAIDecision(news, {
    historicalMemory,
  });
  const engineSummary = aiDecision.decisionSummary;
  const sortedNews = addHistoricalMemory(
    aiDecision.news,
    historicalMemory,
  );
  const newsCounts = {
    total: engineSummary.totalNews,
    ...engineSummary.sentimentCounts,
    highImpact: sortedNews.filter(
      (item) => item.impactLabel === "High",
    ).length,
  };

  return {
    news: sortedNews,
    aiImpactScore: engineSummary.aiImpactScore,
    sentiment: engineSummary.sentiment,
    overallSentiment: engineSummary.sentiment || "neutral",
    confidence: engineSummary.confidence,
    riskLevel: engineSummary.riskLevel,
    decisionLabel: engineSummary.decisionLabel,
    keyReason: engineSummary.keyReason,
    catalysts: engineSummary.catalysts,
    warnings: engineSummary.warnings,
    newsCounts,
    topNews: getTopNews(aiDecision.criticalNews),
    aiDecisionSummary: engineSummary,
    historicalMemory,
  };
}
