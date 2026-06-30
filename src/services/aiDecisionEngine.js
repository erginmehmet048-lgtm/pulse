const VALID_SENTIMENTS = new Set(["positive", "negative", "neutral"]);
const MAX_CRITICAL_NEWS = 3;

function normalizeScore(value) {
  const score = Number(value);

  if (!Number.isFinite(score) || score <= 0) return null;
  return Math.min(Math.round(score), 100);
}

function normalizeSentiment(value) {
  const sentiment = String(value || "").toLowerCase();

  return VALID_SENTIMENTS.has(sentiment) ? sentiment : "neutral";
}

function getImpactLabel(impactScore) {
  if (impactScore === null) return null;
  if (impactScore >= 70) return "High";
  if (impactScore >= 40) return "Medium";

  return "Low";
}

function getPublishedTime(value) {
  const time = new Date(value).getTime();

  return Number.isFinite(time) ? time : 0;
}

function normalizeNewsItem(item) {
  const impactScore = normalizeScore(
    item?.impactScore ?? item?.importanceScore ?? item?.importance,
  );

  return {
    ...item,
    sentiment: normalizeSentiment(item?.sentiment),
    confidence: normalizeScore(item?.confidence),
    impactScore,
    importanceScore: impactScore,
    impactLabel: getImpactLabel(impactScore),
  };
}

function rankNews(news) {
  return news
    .map(normalizeNewsItem)
    .sort(
      (first, second) =>
        (second.impactScore ?? -1) - (first.impactScore ?? -1) ||
        getPublishedTime(second.publishedAt) -
          getPublishedTime(first.publishedAt),
    );
}

function getSentimentCounts(news) {
  return news.reduce(
    (counts, item) => {
      counts[item.sentiment] += 1;
      return counts;
    },
    { positive: 0, negative: 0, neutral: 0 },
  );
}

function getSentiment(news) {
  const weightedSentiment = news.reduce((score, item) => {
    if (item.sentiment === "positive") return score + item.impactScore;
    if (item.sentiment === "negative") return score - item.impactScore;
    return score;
  }, 0);
  const totalImpact = news.reduce(
    (total, item) => total + item.impactScore,
    0,
  );

  if (!totalImpact) return null;

  const sentimentRatio = weightedSentiment / totalImpact;
  if (sentimentRatio >= 0.15) return "positive";
  if (sentimentRatio <= -0.15) return "negative";

  return "neutral";
}

function getAverageScore(news, field) {
  const scores = news
    .map((item) => normalizeScore(item[field]))
    .filter((score) => score !== null);

  if (!scores.length) return null;

  return Math.round(
    scores.reduce((total, score) => total + score, 0) / scores.length,
  );
}

function getConfidence(criticalNews, rankedNews, sentimentCounts) {
  const averageConfidence = getAverageScore(criticalNews, "confidence");

  if (averageConfidence === null) return null;

  const confidenceCoverage =
    criticalNews.filter((item) => item.confidence !== null).length /
    criticalNews.length;
  const scoreCoverage =
    rankedNews.filter((item) => item.impactScore !== null).length /
    rankedNews.length;
  const dataMultiplier =
    criticalNews.length >= MAX_CRITICAL_NEWS
      ? 1
      : criticalNews.length === 2
        ? 0.75
        : 0.55;
  const agreementMultiplier =
    sentimentCounts.positive > 0 && sentimentCounts.negative > 0
      ? 0.85
      : 1;

  return normalizeScore(
    averageConfidence *
      confidenceCoverage *
      scoreCoverage *
      dataMultiplier *
      agreementMultiplier,
  );
}

function getRiskLevel({
  confidence,
  criticalNews,
  sentiment,
  sentimentCounts,
}) {
  if (!criticalNews.length) return "NO DATA";

  const hasHighImpactNegative = criticalNews.some(
    (item) =>
      item.sentiment === "negative" && item.impactLabel === "High",
  );
  const negativeRatio =
    sentimentCounts.negative / Math.max(criticalNews.length, 1);

  if (
    hasHighImpactNegative ||
    sentiment === "negative" ||
    negativeRatio >= 0.34 ||
    confidence === null ||
    confidence < 45 ||
    criticalNews.length === 1
  ) {
    return "High";
  }

  if (
    criticalNews.length < MAX_CRITICAL_NEWS ||
    confidence < 65 ||
    sentiment === "neutral" ||
    sentimentCounts.negative > 0
  ) {
    return "Medium";
  }

  return "Low";
}

function getDecisionLabel({
  aiImpactScore,
  confidence,
  criticalNews,
  riskLevel,
  sentiment,
}) {
  if (!criticalNews.length || aiImpactScore === null) return "NO DATA";

  if (
    sentiment === "negative" ||
    criticalNews.some(
      (item) =>
        item.sentiment === "negative" && item.impactLabel === "High",
    )
  ) {
    return "RISKY";
  }

  if (
    confidence === null ||
    confidence < 50 ||
    criticalNews.length < 2 ||
    riskLevel === "High"
  ) {
    return "WAIT";
  }

  if (
    sentiment === "positive" &&
    aiImpactScore >= 75 &&
    confidence >= 70 &&
    riskLevel === "Low"
  ) {
    return "STRONG WATCH";
  }

  if (
    sentiment === "positive" &&
    aiImpactScore >= 50 &&
    confidence >= 55
  ) {
    return "BUY WATCH";
  }

  return "WAIT";
}

function shorten(value, maxLength = 100) {
  const text = String(value || "")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trim()}…`;
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function getCatalysts(criticalNews) {
  return unique(
    criticalNews
      .filter(
        (item) =>
          item.sentiment === "positive" && item.impactScore >= 40,
      )
      .map((item) => shorten(item.title)),
  ).slice(0, 2);
}

function getWarnings(criticalNews, rankedNews, sentimentCounts) {
  if (!criticalNews.length) {
    return ["Filtreye uygun, skorlanabilir haber bulunamadı."];
  }

  const warnings = criticalNews
    .filter(
      (item) =>
        item.sentiment === "negative" && item.impactScore >= 40,
    )
    .map((item) => shorten(item.title));

  if (criticalNews.length < MAX_CRITICAL_NEWS) {
    warnings.push(
      `Karar yalnızca ${criticalNews.length} uygun haberle destekleniyor.`,
    );
  }

  if (criticalNews.some((item) => item.confidence === null)) {
    warnings.push("Bazı haberlerde analiz güveni eksik.");
  }

  if (
    sentimentCounts.positive > 0 &&
    sentimentCounts.negative > 0
  ) {
    warnings.push("Kritik haber sinyalleri birbiriyle çelişiyor.");
  }

  if (rankedNews.some((item) => item.impactScore === null)) {
    warnings.push("Skorsuz haberler karar hesabına dahil edilmedi.");
  }

  return unique(warnings).slice(0, 3);
}

function getHistoricalWarnings(historicalMemory) {
  if (!historicalMemory) return [];

  const sourceWarnings = Array.isArray(historicalMemory.warnings)
    ? historicalMemory.warnings.filter(Boolean)
    : [];

  if (historicalMemory.status === "found") {
    const hasSourceBackedMatch =
      Array.isArray(historicalMemory.matches) &&
      historicalMemory.matches.some((match) => match?.sourceReference);

    return hasSourceBackedMatch
      ? []
      : ["Historical matches could not be verified."];
  }

  if (sourceWarnings.length) return sourceWarnings;
  if (historicalMemory.status === "not_found") {
    return ["No source-backed historical match was found."];
  }
  if (historicalMemory.status === "unavailable") {
    return ["Historical data source is not available yet."];
  }

  return [];
}

function getKeyReason({
  aiImpactScore,
  confidence,
  decisionLabel,
  sentiment,
}) {
  if (decisionLabel === "NO DATA") {
    return "Karar üretmek için yeterli ve skorlanabilir haber verisi yok.";
  }

  if (decisionLabel === "RISKY") {
    return "Negatif haber baskısı veya yüksek etkili risk sinyali öne çıkıyor.";
  }

  if (decisionLabel === "STRONG WATCH") {
    return "Yüksek etkili pozitif haberler güçlü ve tutarlı bir izleme sinyali üretiyor.";
  }

  if (decisionLabel === "BUY WATCH") {
    return "Pozitif haber akışı izlemeye değer; karar için yeni teyitler takip edilmeli.";
  }

  if (confidence === null || confidence < 50) {
    return "Mevcut veri güveni düşük; daha güçlü haber teyidi beklenmeli.";
  }

  if (sentiment === "neutral") {
    return "Haber akışı yön konusunda yeterince net değil; beklemek daha temkinli.";
  }

  return `Haber etkisi ${aiImpactScore}/100 seviyesinde, ancak karar koşulları henüz yeterince güçlü değil.`;
}

export function generateAIDecision(news = [], context = {}) {
  const rankedNews = rankNews(Array.isArray(news) ? news : []);
  const criticalNews = rankedNews
    .filter((item) => item.impactScore !== null)
    .slice(0, MAX_CRITICAL_NEWS);
  const sentimentCounts = getSentimentCounts(criticalNews);
  const sentiment = getSentiment(criticalNews);
  const aiImpactScore = getAverageScore(criticalNews, "impactScore");
  const confidence = criticalNews.length
    ? getConfidence(criticalNews, rankedNews, sentimentCounts)
    : null;
  const riskLevel = getRiskLevel({
    confidence,
    criticalNews,
    sentiment,
    sentimentCounts,
  });
  const decisionLabel = getDecisionLabel({
    aiImpactScore,
    confidence,
    criticalNews,
    riskLevel,
    sentiment,
  });
  const summaryContext = {
    aiImpactScore,
    confidence,
    decisionLabel,
    sentiment,
  };
  const warnings = unique([
    ...getHistoricalWarnings(context?.historicalMemory),
    ...getWarnings(criticalNews, rankedNews, sentimentCounts),
  ]).slice(0, 3);

  return {
    news: rankedNews,
    criticalNews,
    decisionSummary: {
      aiImpactScore,
      sentiment,
      confidence,
      riskLevel,
      decisionLabel,
      keyReason: getKeyReason(summaryContext),
      catalysts: getCatalysts(criticalNews),
      warnings,
      hasData: criticalNews.length > 0,
      totalNews: rankedNews.length,
      sentimentCounts,
    },
  };
}
