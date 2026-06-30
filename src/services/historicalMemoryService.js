const SERVICE_VERSION = "1.0.0";
const UNAVAILABLE_WARNING =
  "Historical data source is not available yet.";

function normalizeMatch(match) {
  const sourceReference = String(match?.sourceReference || "").trim();

  if (!sourceReference) return null;

  return {
    eventType: match.eventType || null,
    matchedKeywords: Array.isArray(match.matchedKeywords)
      ? [...match.matchedKeywords]
      : [],
    similarityScore: Number.isFinite(match.similarityScore)
      ? match.similarityScore
      : null,
    sourceReference,
    eventDate: match.eventDate || null,
    observedMove: Number.isFinite(match.observedMove)
      ? match.observedMove
      : null,
    reactionDays: Number.isFinite(match.reactionDays)
      ? match.reactionDays
      : null,
  };
}

function createResponse({
  status,
  confidence = null,
  matches = [],
  warnings = [],
  source = null,
}) {
  return {
    status,
    confidence,
    matches: Array.isArray(matches)
      ? matches.map(normalizeMatch).filter(Boolean)
      : [],
    warnings: Array.isArray(warnings) ? [...warnings] : [],
    metadata: {
      generatedAt: new Date().toISOString(),
      version: SERVICE_VERSION,
      source,
    },
  };
}

const unavailableSourceAdapter = {
  retrieve() {
    return createResponse({
      status: "unavailable",
      matches: [],
      warnings: [UNAVAILABLE_WARNING],
      source: null,
    });
  },
};

export function retrieveHistoricalMemory() {
  return unavailableSourceAdapter.retrieve();
}
