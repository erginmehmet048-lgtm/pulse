import { useMemo, useState } from "react";
import AIDecisionCenter from "./components/AIDecisionCenter";
import HistoricalMemorySummary from "./components/HistoricalMemorySummary";
import NewsFeed from "./components/NewsFeed";
import TopCriticalNews from "./components/TopCriticalNews";
import {
  DEFAULT_MARKET_ID,
  getDefaultSymbol,
  getMarketById,
  MARKETS,
} from "./data/markets";
import { useNews } from "./hooks/useNews";
import { generateDecisionSummary } from "./services/decisionCenterService";

function Dashboard() {
  const defaultMarket = getMarketById(DEFAULT_MARKET_ID);
  const [selectedMarketId, setSelectedMarketId] =
    useState(defaultMarket?.id || "");
  const selectedMarket = getMarketById(selectedMarketId);
  const [selectedSymbol, setSelectedSymbol] = useState(
    getDefaultSymbol(defaultMarket),
  );
  const availableSymbols = Array.isArray(selectedMarket?.defaultSymbols)
    ? selectedMarket.defaultSymbols
    : [];
  const activeSymbol = availableSymbols.includes(selectedSymbol)
    ? selectedSymbol
    : getDefaultSymbol(selectedMarket);
  const activeMarketId = selectedMarket?.id || "";
  const { news, isLoading: isNewsLoading } = useNews({
    market: activeMarketId,
    symbol: activeSymbol,
  });
  const decisionSummary = useMemo(
    () =>
      generateDecisionSummary(
        news,
        activeSymbol,
        activeMarketId,
      ),
    [activeMarketId, activeSymbol, news],
  );

  function handleMarketChange(marketId) {
    const nextMarket = getMarketById(marketId);
    const nextSymbol = getDefaultSymbol(nextMarket);

    if (!nextMarket?.id) {
      setSelectedMarketId("");
      setSelectedSymbol("");
      return;
    }

    setSelectedMarketId(nextMarket.id);
    setSelectedSymbol(nextSymbol);
  }

  function handleSymbolChange(symbol) {
    const normalizedSymbol = String(symbol || "").trim().toUpperCase();

    if (!availableSymbols.includes(normalizedSymbol)) return;
    setSelectedSymbol(normalizedSymbol);
  }

  return (
    <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
      <AIDecisionCenter
        markets={MARKETS}
        onMarketChange={handleMarketChange}
        onSymbolChange={handleSymbolChange}
        selectedMarketId={activeMarketId}
        symbol={activeSymbol}
        summary={decisionSummary}
      />

      <TopCriticalNews
        isLoading={isNewsLoading}
        news={decisionSummary.topNews}
      />

      <HistoricalMemorySummary
        summary={decisionSummary.historicalMemory}
      />

      <NewsFeed
        isLoading={isNewsLoading}
        news={decisionSummary.news}
      />
    </main>
  );
}

export default Dashboard;
