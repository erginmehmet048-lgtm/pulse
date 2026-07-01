import { useEffect, useMemo, useState } from "react";
import AIDecisionCenter from "./components/AIDecisionCenter";
import LiveMarketCard from "./components/LiveMarketCard";
import NewsFeed from "./components/NewsFeed";
import TopCriticalNews from "./components/TopCriticalNews";
import {
  DEFAULT_MARKET_ID,
  getDefaultSymbol,
  getMarketById,
  MARKETS,
} from "./data/markets";
import { useNews } from "./hooks/useNews";
import { buildDecisionSummary } from "./services/decisionCenterService";
import { getMarketSnapshot } from "./services/marketService";

function LoadingPanel() {
  return (
    <div
      className="mb-6 overflow-hidden rounded-2xl border border-cyan-200/10 bg-[#0b1320] p-5"
      role="status"
    >
      <div className="flex items-center gap-3">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300" />
        <p className="text-sm font-medium text-cyan-100">Veriler yükleniyor…</p>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-20 animate-pulse rounded-xl bg-white/[0.04]"
          />
        ))}
      </div>
    </div>
  );
}

function DataNotice({ onRetry }) {
  return (
    <div
      className="mb-6 flex flex-col gap-4 rounded-2xl border border-amber-300/15 bg-amber-300/[0.045] p-4 sm:flex-row sm:items-center sm:justify-between"
      role="alert"
    >
      <div>
        <p className="text-sm font-semibold text-amber-100">
          Veri alınamadı, demo veri gösteriliyor
        </p>
        <p className="mt-1 text-xs leading-5 text-amber-100/55">
          Haber servisine yeniden bağlanabilir veya mevcut fallback ile devam
          edebilirsin.
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="shrink-0 rounded-xl border border-amber-200/20 bg-amber-100/[0.06] px-4 py-2 text-xs font-semibold text-amber-50 transition hover:bg-amber-100/[0.1]"
      >
        Tekrar dene
      </button>
    </div>
  );
}

function Dashboard() {
  const defaultMarket = getMarketById(DEFAULT_MARKET_ID);
  const [selectedMarketId, setSelectedMarketId] = useState(
    defaultMarket?.id || "",
  );
  const selectedMarket = getMarketById(selectedMarketId);
  const [selectedSymbol, setSelectedSymbol] = useState(
    getDefaultSymbol(defaultMarket),
  );
  const [market, setMarket] = useState(null);
  const [isMarketLoading, setIsMarketLoading] = useState(true);
  const availableSymbols = Array.isArray(selectedMarket?.defaultSymbols)
    ? selectedMarket.defaultSymbols
    : [];
  const activeSymbol = availableSymbols.includes(selectedSymbol)
    ? selectedSymbol
    : getDefaultSymbol(selectedMarket);
  const activeMarketId = selectedMarket?.id || "";
  const {
    news,
    isLoading: isNewsLoading,
    error: newsError,
    isFallback,
    retry,
  } = useNews({ symbol: activeSymbol, limit: 12 });

  useEffect(() => {
    let isActive = true;
    setIsMarketLoading(true);

    getMarketSnapshot(activeSymbol).then((snapshot) => {
      if (!isActive) return;
      setMarket(snapshot);
      setIsMarketLoading(false);
    });

    return () => {
      isActive = false;
    };
  }, [activeSymbol]);

  const sortedNews = useMemo(
    () =>
      [...(Array.isArray(news) ? news : [])].sort(
        (a, b) =>
          (Number(b?.relevanceScore) || 0) -
          (Number(a?.relevanceScore) || 0),
      ),
    [news],
  );
  const decisionSummary = useMemo(
    () =>
      buildDecisionSummary({
        symbol: activeSymbol,
        news: sortedNews,
        market,
      }),
    [activeSymbol, market, sortedNews],
  );
  const isLoading = isNewsLoading || isMarketLoading;
  const hasFallbackWarning =
    Boolean(newsError || market?.errorMessage) && !isLoading;

  function handleMarketChange(marketId) {
    const nextMarket = getMarketById(marketId);
    setSelectedMarketId(nextMarket?.id || "");
    setSelectedSymbol(getDefaultSymbol(nextMarket));
  }

  function handleSymbolChange(symbol) {
    const normalizedSymbol = String(symbol || "").trim().toUpperCase();
    if (availableSymbols.includes(normalizedSymbol)) {
      setSelectedSymbol(normalizedSymbol);
    }
  }

  return (
    <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-[1280px]">
        <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Pulse Intelligence
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
              Piyasa ve haber karar ekranı
            </h1>
          </div>
          <p className="max-w-md text-xs leading-5 text-slate-500 sm:text-right">
            Canlı kaynaklar, ilişki analizi ve açıklanabilir etki sinyali tek
            akışta.
          </p>
        </header>

        {isLoading && <LoadingPanel />}
        {hasFallbackWarning && <DataNotice onRetry={retry} />}

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.75fr)]">
          <AIDecisionCenter
            markets={MARKETS}
            onMarketChange={handleMarketChange}
            onSymbolChange={handleSymbolChange}
            selectedMarketId={activeMarketId}
            symbol={activeSymbol}
            summary={decisionSummary}
          />
          <LiveMarketCard
            isLoading={isMarketLoading}
            marketName={selectedMarket?.name}
            snapshot={market}
          />
        </div>

        <TopCriticalNews
          isLoading={isNewsLoading}
          news={sortedNews.slice(0, 3)}
        />

        <NewsFeed
          isFallback={isFallback}
          isLoading={isNewsLoading}
          news={sortedNews}
        />
      </div>
    </main>
  );
}

export default Dashboard;
