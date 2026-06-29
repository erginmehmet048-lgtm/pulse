import Header from "./components/Header";
import NewsFeed from "./components/NewsFeed";
import AiImpactCard from "./components/AiImpactCard";
import InsightSummary from "./components/InsightSummary";
import LiveMarketCard from "./components/LiveMarketCard";
import { useNews } from "./hooks/useNews";
import { getHistoricalReaction } from "./services/historicalEngine";
import { getMarketSnapshot } from "./services/marketService";

const FALLBACK_IMPACT_SCORE = 94;
const FALLBACK_SIMILAR_EVENTS = 17;
const FALLBACK_POSITIVE_REACTION_RATE = 82;

function getImportanceScore(item) {
  const value =
    item.analysis?.importanceScore ?? item.importanceScore ?? item.importance;
  const score = Number(value);

  return Number.isFinite(score) ? Math.min(Math.max(score, 0), 100) : null;
}

function getPublishedTime(value) {
  const time = new Date(value).getTime();

  return Number.isFinite(time) ? time : 0;
}

function Dashboard() {
  const news = useNews();
  const marketSnapshot = getMarketSnapshot("SPCX");
  const importanceScores = news
    .map(getImportanceScore)
    .filter((score) => score !== null);

  const impactScore = importanceScores.length
    ? Math.round(
        importanceScores.reduce((total, score) => total + score, 0) /
          importanceScores.length,
      )
    : FALLBACK_IMPACT_SCORE;

  const status =
    impactScore > 75
      ? "BUY WATCH"
      : impactScore >= 45
        ? "NEUTRAL WATCH"
        : "SELL/RISK WATCH";

  const importantNewsCount = importanceScores.filter(
    (score) => score >= 70,
  ).length;

  const confidenceScores = news
    .map((item) => Number(item.confidence))
    .filter(Number.isFinite);
  const confidence = confidenceScores.length
    ? Math.round(
        confidenceScores.reduce((total, score) => total + score, 0) /
          confidenceScores.length,
      )
    : 93;

  const uniqueHistoricalResults = Array.from(
    new Map(
      news.map((item) => [
        `${item.stock}:${item.eventType}`,
        getHistoricalReaction(item.stock, item.eventType),
      ]),
    ).values(),
  ).filter((history) => history.events > 0);

  const similarEventsCount = uniqueHistoricalResults.length
    ? Math.max(...uniqueHistoricalResults.map((history) => history.events))
    : FALLBACK_SIMILAR_EVENTS;

  const reactionRates = uniqueHistoricalResults
    .map(
      (history) =>
        history.positiveReactionRate ?? history.positiveRate ?? null,
    )
    .filter((rate) => rate !== null)
    .map(Number)
    .filter(Number.isFinite);

  const positiveReactionRate = reactionRates.length
    ? Math.round(
        reactionRates.reduce((total, rate) => total + rate, 0) /
          reactionRates.length,
      )
    : FALLBACK_POSITIVE_REACTION_RATE;

  const topSignals = [...news]
    .sort(
      (first, second) =>
        (getImportanceScore(second) ?? 0) -
          (getImportanceScore(first) ?? 0) ||
        getPublishedTime(second.publishedAt) -
          getPublishedTime(first.publishedAt),
    )
    .slice(0, 3)
    .map((item) => ({
      title: item.title,
      summary: item.originalSummary || item.summary || item.description || "",
      importanceScore: getImportanceScore(item) ?? 0,
    }));

  return (
    <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
      <Header />

      <LiveMarketCard
        symbol={marketSnapshot.symbol}
        price={marketSnapshot.price}
        change={marketSnapshot.change}
        changePercent={marketSnapshot.changePercent}
        impactScore={impactScore}
        status={status}
        importantNewsCount={importantNewsCount}
        confidence={confidence}
        lastUpdate={marketSnapshot.lastUpdate}
      />
      <AiImpactCard
        impactScore={impactScore}
        status={status}
        importantNewsCount={importantNewsCount}
        similarEventsCount={similarEventsCount}
        positiveReactionRate={positiveReactionRate}
      />
      <NewsFeed news={news} />
      <InsightSummary
        impactScore={impactScore}
        status={status}
        importantNewsCount={importantNewsCount}
        similarEventsCount={similarEventsCount}
        positiveReactionRate={positiveReactionRate}
        topSignals={topSignals}
      />
    </main>
  );
}

export default Dashboard;
