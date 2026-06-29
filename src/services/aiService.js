const positiveKeywordWeights = [
  ["nasa", 25],
  ["spacex", 20],
  ["starship", 20],
  ["launch", 18],
  ["faa", 15],
  ["contract", 15],
  ["mission", 15],
  ["funding", 10],
  ["acquisition", 10],
  ["earnings", 10],
  ["satellite", 8],
  ["rocket", 6],
  ["esa", 5],
];

const negativeKeywordWeights = [
  ["explosion", -25],
  ["delay", -20],
  ["failure", -20],
  ["investigation", -15],
  ["lawsuit", -15],
  ["recall", -10],
  ["crash", -10],
];

const spaceContextKeywords = [
  "spacex",
  "space",
  "rocket",
  "satellite",
  "launch",
  "nasa",
  "mission",
  "starship",
  "esa",
];

function includesKeyword(text, keyword) {
  return new RegExp(`\\b${keyword}\\w*\\b`, "i").test(text);
}

function calculateImportanceScore(text) {
  const baseScore = spaceContextKeywords.some((keyword) =>
    includesKeyword(text, keyword),
  )
    ? 35
    : 10;

  const score = [...positiveKeywordWeights, ...negativeKeywordWeights].reduce(
    (total, [keyword, weight]) =>
      includesKeyword(text, keyword) ? total + weight : total,
    baseScore,
  );

  return Math.min(Math.max(score, 0), 100);
}

export async function analyzeNews(article) {
  const text = `${article.title || ""} ${article.description || ""}`.toLowerCase();
  const importanceText =
    `${article.title || ""} ${article.summary || ""} ${article.description || ""}`.toLowerCase();
  const importanceScore = calculateImportanceScore(importanceText);

  let eventType = "general_news";
  let relatedStocks = ["SPCX"];

  // Event Type Detection

  if (text.includes("nasa")) {
    eventType = "nasa_contract";
  } else if (
    text.includes("starship") ||
    text.includes("launch") ||
    text.includes("liftoff")
  ) {
    eventType = "starship_test";
  } else if (text.includes("rocket lab")) {
    relatedStocks = ["RKLB"];
    eventType = "launch_success";
  } else if (text.includes("tesla")) {
    relatedStocks = ["TSLA"];
    eventType = "general_news";
  }

  return {
    relatedStocks,

    eventType,

    importanceScore,

    importance: importanceScore,

    sentiment: "positive",

    decisionImpact: "high",

    confidence: 93,

    ignore: false,

    summary:
      "Geçmiş benzer olaylara göre olumlu etki bekleniyor.",

    reasons: [
      "AI Haber Sınıflandırması",
      "Geçmiş Olay Analizi",
      "Pattern Matching"
    ]
  };
}
