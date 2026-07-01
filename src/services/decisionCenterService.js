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

function clamp(value) {
  return Math.min(Math.max(Math.round(Number(value) || 0), 0), 100);
}

function findWords(text, words) {
  const normalized = String(text || "").toLocaleLowerCase("en-US");
  return words.filter((word) => normalized.includes(word));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

export function buildDecisionSummary({ symbol, news, market } = {}) {
  const items = Array.isArray(news) ? news.filter(Boolean) : [];
  const positiveMatches = [];
  const negativeMatches = [];

  items.forEach((item) => {
    const text = `${item?.title || ""} ${item?.summary || ""}`;
    positiveMatches.push(...findWords(text, POSITIVE_WORDS));
    negativeMatches.push(...findWords(text, NEGATIVE_WORDS));
  });

  const positiveCount = positiveMatches.length;
  const negativeCount = negativeMatches.length;
  const keywordEvidence = positiveCount + negativeCount;
  const marketMove = Number(market?.changePercent);
  const marketContribution = Number.isFinite(marketMove)
    ? Math.min(Math.max(marketMove * 1.5, -10), 10)
    : 0;
  const newsContribution = Math.min((positiveCount - negativeCount) * 6, 30);
  const aiImpactScore = clamp(50 + newsContribution + marketContribution);
  const sentiment =
    positiveCount > negativeCount
      ? "positive"
      : negativeCount > positiveCount
        ? "negative"
        : "neutral";
  const signal =
    aiImpactScore >= 62 && sentiment !== "negative"
      ? "BUY WATCH"
      : aiImpactScore <= 42 || sentiment === "negative"
        ? "RISK WATCH"
        : "NEUTRAL WATCH";
  const averageRelevance = items.length
    ? items.reduce(
        (total, item) => total + (Number(item?.relevanceScore) || 0),
        0,
      ) / items.length
    : 0;
  const confidenceScore = clamp(
    28 +
      Math.min(items.length * 7, 35) +
      Math.min(keywordEvidence * 5, 25) +
      (market?.price != null ? 8 : 0) +
      averageRelevance * 0.08,
  );
  const importantNewsCount = items.filter(
    (item) => Number(item?.relevanceScore) >= 50,
  ).length;
  const topReasons = [];
  const riskNotes = [];

  if (positiveCount) {
    topReasons.push(
      `${positiveCount} pozitif etki ifadesi: ${unique(positiveMatches)
        .slice(0, 3)
        .join(", ")}.`,
    );
  }
  if (Number.isFinite(marketMove)) {
    topReasons.push(
      `${symbol || "Varlık"} gün içi değişimi ${marketMove >= 0 ? "+" : ""}${marketMove.toFixed(2)}%.`,
    );
  }
  if (importantNewsCount) {
    topReasons.push(`${importantNewsCount} haber yüksek ilişki skoru taşıyor.`);
  }
  if (!topReasons.length) {
    topReasons.push("Yön oluşturmak için haber kanıtı henüz sınırlı.");
  }

  if (negativeCount) {
    riskNotes.push(
      `${negativeCount} risk ifadesi: ${unique(negativeMatches)
        .slice(0, 3)
        .join(", ")}.`,
    );
  }
  if (!items.length) riskNotes.push("Haber verisi bulunmadığı için güven düşürüldü.");
  if (!market?.isLive) riskNotes.push("Piyasa snapshot’ı demo veridir.");
  if (!riskNotes.length) riskNotes.push("Belirgin negatif haber sinyali saptanmadı.");

  return {
    aiImpactScore,
    signal,
    sentiment,
    confidenceScore,
    topReasons: topReasons.slice(0, 3),
    riskNotes: riskNotes.slice(0, 3),
    importantNewsCount,
  };
}

// Kept as a compatibility adapter for older consumers.
export function generateDecisionSummary(news = [], symbol, market) {
  return buildDecisionSummary({ symbol, news, market });
}
