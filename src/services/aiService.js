export async function analyzeNews(article) {
  return {
    relatedStocks: ["SPCX"],

    importance: 94,

    sentiment: "positive",

    decisionImpact: "high",

    confidence: 93,

    ignore: false,

    summary:
      "Starship gelişmesi kısa vadede SPCX için olumlu beklenti oluşturuyor.",

    reasons: [
      "Starship",
      "NASA",
      "Görev takvimi"
    ]
  };
}