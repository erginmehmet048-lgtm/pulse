const HISTORICAL_REASONS = {
  "Strong Positive":
    "Similar historical events mostly led to positive short-term reactions.",
  "Weak Positive":
    "Similar historical events showed mildly positive short-term reactions.",
  Neutral:
    "Similar historical events produced a balanced price response.",
  "Weak Negative":
    "Similar historical events showed mildly negative short-term reactions.",
  "Strong Negative":
    "Similar historical events mostly led to negative short-term reactions.",
  "Insufficient Data":
    "There is not enough historical data to strongly support this signal.",
};

function getPositiveFactors(summary, counts) {
  const factors = [];

  if (counts.highImpact >= 2) {
    factors.push("Multiple high-impact news items are driving the score.");
  } else if (counts.highImpact === 1) {
    factors.push("A high-impact news item is supporting the score.");
  }

  if (counts.positive > counts.negative) {
    factors.push("Positive news flow outweighs negative signals.");
  }

  if (
    ["Strong Positive", "Weak Positive"].includes(
      summary.historicalSignal,
    )
  ) {
    factors.push("Historical memory adds positive support.");
  }

  return factors.length
    ? factors.slice(0, 2)
    : ["No strong positive driver is present in the current news flow."];
}

function getNegativeFactors(summary, counts) {
  const factors = [];

  if (counts.negative > 0) {
    factors.push("Negative news flow increases short-term risk.");
  }

  if (summary.riskLevel === "High") {
    factors.push("The current risk profile remains elevated.");
  }

  if (
    ["Strong Negative", "Weak Negative"].includes(
      summary.historicalSignal,
    )
  ) {
    factors.push("Historical memory adds downside pressure.");
  }

  return factors.length
    ? factors.slice(0, 2)
    : ["No material negative news driver is currently detected."];
}

function getConfidenceReason(summary) {
  const hasHistoricalSupport =
    summary.historicalSignal !== "Insufficient Data";
  const hasDirectionalSentiment = summary.overallSentiment !== "neutral";

  if (summary.averageConfidence >= 75) {
    if (hasHistoricalSupport && hasDirectionalSentiment) {
      return "Confidence is supported by consistent sentiment and historical alignment.";
    }

    if (hasHistoricalSupport) {
      return "Confidence is supported by stable classifications and available historical evidence.";
    }

    return "Confidence is supported by news consistency, while historical evidence remains limited.";
  }

  if (summary.averageConfidence >= 55) {
    return "Confidence is moderate because the current signals are not fully aligned.";
  }

  return "Confidence remains limited because current signals are sparse or mixed.";
}

function getNewsFlowReason(summary, counts) {
  if (!counts.total) return "No analyzed news is available yet.";

  if (summary.overallSentiment === "positive") {
    return `${counts.positive} of ${counts.total} analyzed news items support a positive view.`;
  }

  if (summary.overallSentiment === "negative") {
    return `${counts.negative} of ${counts.total} analyzed news items add negative pressure.`;
  }

  return `The flow is mixed, with ${counts.positive} positive, ${counts.neutral} neutral, and ${counts.negative} negative items.`;
}

function getFinalTakeaway(summary, counts) {
  if (!counts.total) {
    return "Wait for additional news before relying on the current score.";
  }

  if (summary.riskLevel === "High") {
    return "Treat the signal cautiously until the main negative catalysts weaken.";
  }

  if (
    summary.overallSentiment === "positive" &&
    ["Strong Positive", "Weak Positive"].includes(
      summary.historicalSignal,
    )
  ) {
    return "The evidence leans positive, but fresh news and price confirmation still matter.";
  }

  if (
    summary.overallSentiment === "negative" ||
    ["Strong Negative", "Weak Negative"].includes(
      summary.historicalSignal,
    )
  ) {
    return "Downside risk is elevated, so new catalysts should be monitored closely.";
  }

  return "The score remains balanced and needs a clearer catalyst for direction.";
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
    riskLevel: decisionSummary.riskLevel || "Medium",
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
