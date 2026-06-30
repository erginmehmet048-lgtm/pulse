import { useMemo, useState } from "react";
import Header from "./components/Header";
import NewsFeed from "./components/NewsFeed";
import AIDecisionCenter from "./components/AIDecisionCenter";
import AiImpactCard from "./components/AiImpactCard";
import InsightSummary from "./components/InsightSummary";
import LiveMarketCard from "./components/LiveMarketCard";
import MarketSelector from "./components/MarketSelector";
import {
  DEFAULT_MARKET_ID,
  getMarketById,
  MARKETS,
} from "./data/markets";
import { useNews } from "./hooks/useNews";
import { generateDecisionSummary } from "./services/decisionCenterService";
import { generateExplanation } from "./services/explainableAIService";
import { getMarketSnapshot } from "./services/marketService";

function Dashboard() {
  const news = useNews();
  const [selectedMarketId, setSelectedMarketId] =
    useState(DEFAULT_MARKET_ID);
  const selectedMarket = getMarketById(selectedMarketId);
  const [selectedSymbol, setSelectedSymbol] = useState(
    selectedMarket.defaultSymbols[0],
  );
  const marketSnapshot = getMarketSnapshot(selectedSymbol);
  const decisionSummary = useMemo(
    () =>
      generateDecisionSummary(
        news,
        selectedSymbol,
        selectedMarket.id,
      ),
    [news, selectedMarket.id, selectedSymbol],
  );
  const decisionExplanation = useMemo(
    () => generateExplanation(decisionSummary),
    [decisionSummary],
  );

  function handleMarketChange(marketId) {
    const nextMarket = getMarketById(marketId);

    setSelectedMarketId(nextMarket.id);
    setSelectedSymbol(nextMarket.defaultSymbols[0]);
  }

  return (
    <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
      <Header marketName={selectedMarket.name} symbol={selectedSymbol} />

      <AIDecisionCenter
        explanation={decisionExplanation}
        symbol={selectedSymbol}
        summary={decisionSummary}
      />

      <MarketSelector
        markets={MARKETS}
        selectedMarketId={selectedMarket.id}
        selectedSymbol={selectedSymbol}
        onMarketChange={handleMarketChange}
        onSymbolChange={setSelectedSymbol}
      />

      <LiveMarketCard
        symbol={marketSnapshot.symbol}
        name={marketSnapshot.name}
        marketName={selectedMarket.name}
        price={marketSnapshot.price}
        change={marketSnapshot.change}
        changePercent={marketSnapshot.changePercent}
        currency={marketSnapshot.currency}
        impactScore={decisionSummary.averageImportance}
        status={decisionSummary.status}
        importantNewsCount={decisionSummary.importantNewsCount}
        confidence={decisionSummary.averageConfidence}
        lastUpdate={marketSnapshot.lastUpdate}
      />
      <AiImpactCard
        impactScore={decisionSummary.averageImportance}
        status={decisionSummary.status}
        importantNewsCount={decisionSummary.importantNewsCount}
        similarEventsCount={decisionSummary.similarEventsCount}
        positiveReactionRate={decisionSummary.positiveReactionRate}
      />
      <NewsFeed news={decisionSummary.news} />
      <InsightSummary
        impactScore={decisionSummary.averageImportance}
        status={decisionSummary.status}
        importantNewsCount={decisionSummary.importantNewsCount}
        similarEventsCount={decisionSummary.similarEventsCount}
        positiveReactionRate={decisionSummary.positiveReactionRate}
        topSignals={decisionSummary.topNews}
      />
    </main>
  );
}

export default Dashboard;
