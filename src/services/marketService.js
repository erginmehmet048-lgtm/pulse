const mockMarketSnapshots = {
  SPCX: {
    symbol: "SPCX",
    name: "SpaceX Intelligence",
    price: 165.32,
    change: 12.09,
    changePercent: 7.89,
    lastUpdate: "2 min ago",
  },
};

export function getMarketSnapshot(symbol) {
  const normalizedSymbol = symbol?.trim().toUpperCase();
  const snapshot = mockMarketSnapshots[normalizedSymbol];

  return snapshot ? { ...snapshot } : null;
}
