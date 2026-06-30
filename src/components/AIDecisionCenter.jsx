import MarketSelector from "./MarketSelector";

const decisionStyles = {
  "STRONG WATCH": {
    label: "STRONG WATCH",
    className: "text-emerald-200",
    badge: "border-emerald-300/25 bg-emerald-300/[0.09]",
  },
  "BUY WATCH": {
    label: "BUY WATCH",
    className: "text-cyan-200",
    badge: "border-cyan-300/25 bg-cyan-300/[0.09]",
  },
  WAIT: {
    label: "WAIT",
    className: "text-amber-200",
    badge: "border-amber-300/20 bg-amber-300/[0.07]",
  },
  RISKY: {
    label: "RISKY",
    className: "text-rose-200",
    badge: "border-rose-300/25 bg-rose-300/[0.09]",
  },
  "NO DATA": {
    label: "NO DATA",
    className: "text-slate-400",
    badge: "border-slate-400/20 bg-slate-400/[0.06]",
  },
};

const riskLabels = {
  Low: "Düşük",
  Medium: "Orta",
  High: "Yüksek",
  "NO DATA": "Veri yok",
};

function hasVisibleScore(value) {
  return Number.isFinite(value) && value > 0;
}

function AIDecisionCenter({
  markets,
  onMarketChange,
  onSymbolChange,
  selectedMarketId,
  symbol,
  summary = {},
}) {
  const decision =
    decisionStyles[summary.decisionLabel] ||
    decisionStyles["NO DATA"];
  const catalysts = Array.isArray(summary.catalysts)
    ? summary.catalysts.filter(Boolean)
    : [];
  const warnings = Array.isArray(summary.warnings)
    ? summary.warnings.filter(Boolean)
    : [];
  const displaySymbol = symbol || "Sembol yok";
  const hasImpactScore = hasVisibleScore(summary.aiImpactScore);
  const hasConfidence = hasVisibleScore(summary.confidence);

  return (
    <section className="relative mb-6 overflow-hidden rounded-[28px] border border-cyan-200/[0.16] bg-[#09111d] p-5 shadow-[0_32px_90px_rgba(0,0,0,0.35)] sm:p-7 lg:p-8">
      <div className="pointer-events-none absolute -right-36 -top-48 h-[440px] w-[440px] rounded-full bg-cyan-300/[0.12] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />

      <div className="relative">
        <div className="border-b border-white/[0.08] pb-6">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
                Pulse Decision
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                {displaySymbol}
              </h1>
            </div>
            <div className="text-right">
              <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                Decision Label
              </p>
              <span
                className={`inline-flex rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.08em] ${decision.badge} ${decision.className}`}
              >
                {decision.label}
              </span>
            </div>
          </div>

          <MarketSelector
            compact
            markets={markets}
            selectedMarketId={selectedMarketId}
            selectedSymbol={symbol}
            onMarketChange={onMarketChange}
            onSymbolChange={onSymbolChange}
          />
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] my-6 sm:grid-cols-3">
          <div className="bg-[#09111d] p-5 sm:p-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-slate-600">
              AI Impact
            </p>
            {hasImpactScore ? (
              <p className="mt-3 text-5xl font-semibold leading-none tracking-[-0.05em] text-white">
                {summary.aiImpactScore}
                <span className="ml-1 text-xs font-medium tracking-normal text-slate-600">
                  /100
                </span>
              </p>
            ) : (
              <p className="mt-3 text-xl font-semibold text-slate-400">
                Veri yok
              </p>
            )}
          </div>

          <div className="bg-[#09111d] p-5 sm:p-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-slate-600">
              Confidence
            </p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {hasConfidence ? `%${summary.confidence}` : "Veri yok"}
            </p>
          </div>

          <div className="bg-[#09111d] p-5 sm:p-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-slate-600">
              Risk
            </p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {riskLabels[summary.riskLevel] || "Veri yok"}
            </p>
          </div>
        </div>

        <div className="border-t border-white/[0.08] pt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Neden bu karar?
          </p>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300 sm:text-[15px]">
            {summary.keyReason || "Karar için yeterli veri yok."}
          </p>

          {(catalysts.length > 0 || warnings.length > 0) && (
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {catalysts.length > 0 && (
                <div className="rounded-2xl border border-emerald-300/[0.12] bg-emerald-300/[0.035] p-4">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-300/75">
                    Katalizörler
                  </p>
                  <ul className="mt-3 space-y-2">
                    {catalysts.map((catalyst) => (
                      <li
                        key={catalyst}
                        className="flex gap-2 text-xs leading-5 text-slate-400"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-300" />
                        <span>{catalyst}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {warnings.length > 0 && (
                <div className="rounded-2xl border border-rose-300/[0.12] bg-rose-300/[0.035] p-4">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-rose-300/75">
                    Uyarılar
                  </p>
                  <ul className="mt-3 space-y-2">
                    {warnings.map((warning) => (
                      <li
                        key={warning}
                        className="flex gap-2 text-xs leading-5 text-slate-400"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-rose-300" />
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AIDecisionCenter;
