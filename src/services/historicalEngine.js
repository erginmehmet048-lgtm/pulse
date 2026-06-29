import historicalReactions from "../data/historicalReactions";

export function getHistoricalReaction(stock, eventType) {
  const reaction = historicalReactions.find(
    (item) => item.stock === stock && item.eventType === eventType
  );

  if (!reaction) {
    return {
      events: 0,
      averageMove: "Veri yok",
      timeFrame: "-",
      confidence: 0,
    };
  }

  return {
    events: 17, // Şimdilik sabit, sonra gerçek veri olacak
    averageMove: reaction.averageMove,
    timeFrame: reaction.timeFrame,
    confidence: reaction.confidence,
    label: reaction.label,
  };
}