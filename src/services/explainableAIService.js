const HISTORICAL_REASONS = {
  "Strong Positive":
    "Benzer geçmiş olaylar çoğunlukla pozitif kısa vadeli tepki üretti.",
  "Weak Positive":
    "Benzer geçmiş olaylarda sınırlı pozitif fiyat tepkisi görüldü.",
  Neutral: "Benzer geçmiş olaylar dengeli bir fiyat tepkisi üretti.",
  "Weak Negative":
    "Benzer geçmiş olaylarda sınırlı negatif fiyat tepkisi görüldü.",
  "Strong Negative":
    "Benzer geçmiş olaylar çoğunlukla negatif kısa vadeli tepki üretti.",
  "Insufficient Data":
    "Bu sinyali güçlü biçimde destekleyecek yeterli tarihsel veri yok.",
};

function getPositiveFactors(summary, counts) {
  if (counts.highImpact >= 2) {
    return ["Birden fazla yüksek etkili haber ana skoru destekliyor."];
  }

  if (counts.positive > counts.negative) {
    return ["Pozitif haber akışı negatif sinyallerden daha güçlü."];
  }

  if (
    ["Strong Positive", "Weak Positive"].includes(
      summary.historicalSignal,
    )
  ) {
    return ["Tarihsel hafıza karar görünümüne pozitif destek veriyor."];
  }

  return ["Mevcut akışta güçlü bir pozitif sürükleyici bulunmuyor."];
}

function getNegativeFactors(summary, counts) {
  if (counts.negative > 0) {
    return ["Negatif haber akışı kısa vadeli riski artırıyor."];
  }

  if (summary.riskLevel === "High") {
    return ["Mevcut risk profili yüksek seviyede kalıyor."];
  }

  if (
    ["Strong Negative", "Weak Negative"].includes(
      summary.historicalSignal,
    )
  ) {
    return ["Tarihsel hafıza aşağı yönlü risk baskısı oluşturuyor."];
  }

  return ["Belirgin bir negatif haber sürükleyicisi tespit edilmedi."];
}

function getConfidenceReason(summary) {
  if (summary.averageConfidence >= 75) {
    return "Güven seviyesi, tutarlı haber sınıflandırmasıyla destekleniyor.";
  }

  if (summary.averageConfidence >= 55) {
    return "Güven seviyesi orta; sinyaller henüz tamamen aynı yönde değil.";
  }

  return "Güven seviyesi sınırlı; mevcut sinyaller seyrek veya karışık.";
}

function getNewsFlowReason(summary, counts) {
  if (!counts.total) return "Henüz analiz edilmiş haber bulunmuyor.";

  if (summary.overallSentiment === "positive") {
    return `${counts.total} haberin ${counts.positive} tanesi pozitif görünümü destekliyor.`;
  }

  if (summary.overallSentiment === "negative") {
    return `${counts.total} haberin ${counts.negative} tanesi negatif baskı oluşturuyor.`;
  }

  return `Akış ${counts.positive} pozitif, ${counts.neutral} nötr ve ${counts.negative} negatif haberle dengeli.`;
}

function getFinalTakeaway(summary, counts) {
  if (!counts.total) {
    return "Karara güvenmeden önce ek haber verisi beklenmeli.";
  }

  if (summary.riskLevel === "High") {
    return "Ana negatif katalizörler zayıflayana kadar görünüm temkinli ele alınmalı.";
  }

  if (
    summary.overallSentiment === "positive" &&
    ["Strong Positive", "Weak Positive"].includes(
      summary.historicalSignal,
    )
  ) {
    return "Görünüm pozitif tarafa eğiliyor ancak yeni haber teyidi hâlâ önemli.";
  }

  if (
    summary.overallSentiment === "negative" ||
    ["Strong Negative", "Weak Negative"].includes(
      summary.historicalSignal,
    )
  ) {
    return "Aşağı yönlü risk yüksek olduğu için yeni katalizörler yakından izlenmeli.";
  }

  return "Görünüm dengeli; yön için daha güçlü bir katalizör gerekiyor.";
}

export function generateExplanation(decisionSummary = {}) {
  const counts = {
    total: Number(decisionSummary.newsCounts?.total) || 0,
    positive: Number(decisionSummary.newsCounts?.positive) || 0,
    neutral: Number(decisionSummary.newsCounts?.neutral) || 0,
    negative: Number(decisionSummary.newsCounts?.negative) || 0,
    highImpact: Number(decisionSummary.newsCounts?.highImpact) || 0,
  };
  const normalizedSummary = {
    overallSentiment: decisionSummary.overallSentiment || "neutral",
    riskLevel: decisionSummary.riskLevel || "Insufficient Data",
    averageConfidence: Number(decisionSummary.averageConfidence) || 0,
    historicalSignal:
      decisionSummary.historicalSignal || "Insufficient Data",
  };

  return {
    positiveFactors: getPositiveFactors(normalizedSummary, counts),
    negativeFactors: getNegativeFactors(normalizedSummary, counts),
    historicalReason:
      HISTORICAL_REASONS[normalizedSummary.historicalSignal] ||
      HISTORICAL_REASONS["Insufficient Data"],
    confidenceReason: getConfidenceReason(normalizedSummary),
    newsFlowReason: getNewsFlowReason(normalizedSummary, counts),
    finalTakeaway: getFinalTakeaway(normalizedSummary, counts),
  };
}
