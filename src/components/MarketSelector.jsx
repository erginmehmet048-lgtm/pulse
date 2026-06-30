function MarketButton({ compact, isSelected, market, onSelect }) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelect?.(market.id)}
      className={
        compact
          ? `rounded-lg border px-3 py-2 text-[10px] font-semibold transition ${
              isSelected
                ? "border-cyan-300/30 bg-cyan-300/[0.09] text-cyan-200"
                : "border-white/[0.07] bg-black/10 text-slate-500 hover:border-white/[0.14] hover:text-slate-300"
            }`
          : `flex min-w-0 items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition ${
              isSelected
                ? "border-cyan-300/30 bg-cyan-300/[0.09] text-white shadow-[0_0_24px_rgba(34,211,238,0.06)]"
                : "border-transparent bg-white/[0.025] text-slate-400 hover:border-white/[0.09] hover:text-slate-200"
            }`
      }
    >
      {!compact && (
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-black/20 text-lg"
          aria-hidden="true"
        >
          {market.icon}
        </span>
      )}
      <span className={compact ? "" : "min-w-0"}>
        <span
          className={
            compact
              ? "whitespace-nowrap"
              : "block truncate text-sm font-semibold"
          }
        >
          {market.name}
        </span>
        {!compact && (
          <span className="mt-0.5 block truncate text-[11px] text-slate-500">
            {market.description}
          </span>
        )}
      </span>
    </button>
  );
}

function SymbolButton({ isSelected, onSelect, symbol }) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelect?.(symbol)}
      className={`rounded-lg border px-3 py-2 text-xs font-bold tracking-[0.08em] transition ${
        isSelected
          ? "border-cyan-300/30 bg-cyan-300/[0.1] text-cyan-200"
          : "border-white/[0.07] bg-black/10 text-slate-500 hover:border-white/[0.14] hover:text-slate-300"
      }`}
    >
      {symbol}
    </button>
  );
}

function MarketSelector({
  compact = false,
  markets = [],
  selectedMarketId,
  selectedSymbol,
  onMarketChange,
  onSymbolChange,
}) {
  const selectedMarket = markets.find(
    (market) => market.id === selectedMarketId,
  );
  const marketButtons = markets.filter((market) => market?.id).map((market) => (
    <MarketButton
      compact={compact}
      isSelected={market.id === selectedMarketId}
      key={market.id}
      market={market}
      onSelect={onMarketChange}
    />
  ));
  const symbolButtons = Array.isArray(selectedMarket?.defaultSymbols)
    ? selectedMarket.defaultSymbols.filter(Boolean).map((symbol) => (
        <SymbolButton
          isSelected={symbol === selectedSymbol}
          key={symbol}
          onSelect={onSymbolChange}
          symbol={symbol}
        />
      ))
    : [];

  if (compact) {
    return (
      <div
        className="mt-5 grid gap-3 border-t border-white/[0.07] pt-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
        aria-label="Piyasa ve sembol seçimi"
      >
        <div>
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-600">
            Market
          </p>
          <div className="flex flex-wrap gap-1.5" aria-label="Piyasalar">
            {marketButtons}
          </div>
        </div>
        <div>
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-600 lg:text-right">
            Sembol
          </p>
          <div
            className="flex flex-wrap gap-1.5 lg:justify-end"
            aria-label="Semboller"
          >
            {symbolButtons}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      className="mb-7 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3 backdrop-blur-xl sm:p-4"
      aria-label="Piyasa ve sembol seçimi"
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        <div
          className="grid gap-2 sm:grid-cols-3 xl:min-w-[620px]"
          aria-label="Piyasalar"
        >
          {marketButtons}
        </div>

        <div className="min-w-0 flex-1 border-t border-white/[0.07] pt-4 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
          <div className="mb-2.5 flex items-center justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Sembol seç
            </p>
            <p className="truncate text-[11px] text-cyan-300">
              {selectedMarket?.name} · {selectedSymbol}
            </p>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Semboller">
            {symbolButtons}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MarketSelector;
