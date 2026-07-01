import MarketSelector from "./MarketSelector";

const signalStyles = {
  "BUY WATCH": "border-emerald-300/25 bg-emerald-300/[0.09] text-emerald-200",
  "NEUTRAL WATCH": "border-cyan-300/25 bg-cyan-300/[0.09] text-cyan-200",
  "RISK WATCH": "border-rose-300/25 bg-rose-300/[0.09] text-rose-200",
};

const sentimentLabels = {
  positive: "Pozitif",
  neutral: "Nötr",
  negative: "Negatif",
};

function AIDecisionCenter({
  markets,
  onMarketChange,
  onSymbolChange,
  selectedMarketId,
  symbol,
  summary = {},
}) {
  const reasons = Array.isArray(summary.topReasons)
    ? summary.topReasons.filter(Boolean)
    : [];
  const risks = Array.isArray(summary.riskNotes)
    ? summary.riskNotes.filter(Boolean)
    : [];
  const signal = summary.signal || "NEUTRAL WATCH";

  return (
    <section className="relative mb-0 overflow-hidden rounded-[28px] border border-cyan-200/[0.14] bg-[#09121f] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.3)] sm:p-7">
      <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-cyan-300/[0.1] blur-3xl" />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
              AI Decision Center
            </p>
            <h2 className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-white">
              {symbol || "—"}
            </h2>
          </div>
          <span
            className={`rounded-full border px-4 py-2 text-[11px] font-bold tracking-[0.1em] ${signalStyles[signal] || signalStyles["NEUTRAL WATCH"]}`}
          >
            {signal}
          </span>
        </div>

        <MarketSelector
          compact
          markets={markets}
          selectedMarketId={selectedMarketId}
          selectedSymbol={symbol}
          onMarketChange={onMarketChange}
          onSymbolChange={onSymbolChange}
        />

        <div className="my-6 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-3">
          <Metric label="AI etki skoru" value={`${summary.aiImpactScore ?? 0}/100`} large />
          <Metric label="Güven" value={`%${summary.confidenceScore ?? 0}`} />
          <Metric
            label="Haber tonu"
            value={sentimentLabels[summary.sentiment] || "Nötr"}
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <ReasonList
            accent="emerald"
            items={reasons}
            title="Sinyali destekleyenler"
          />
          <ReasonList accent="rose" items={risks} title="Risk notları" />
        </div>

        <p className="mt-5 border-t border-white/[0.07] pt-4 text-[10px] leading-5 text-slate-600">
          Bu ekran yatırım tavsiyesi değildir; haber ve olası etki okuması
          sunar.
        </p>
      </div>
    </section>
  );
}

function Metric({ label, value, large = false }) {
  return (
    <div className="bg-[#09121f] p-5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-600">
        {label}
      </p>
      <p
        className={`mt-2 font-semibold tracking-[-0.04em] text-white ${large ? "text-4xl" : "text-2xl"}`}
      >
        {value}
      </p>
    </div>
  );
}

function ReasonList({ accent, items, title }) {
  const isPositive = accent === "emerald";
  return (
    <div
      className={`rounded-2xl border p-4 ${
        isPositive
          ? "border-emerald-300/10 bg-emerald-300/[0.025]"
          : "border-rose-300/10 bg-rose-300/[0.025]"
      }`}
    >
      <p
        className={`text-[9px] font-semibold uppercase tracking-[0.16em] ${
          isPositive ? "text-emerald-300/70" : "text-rose-300/70"
        }`}
      >
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-xs leading-5 text-slate-400">
            <span
              className={`mt-2 h-1 w-1 shrink-0 rounded-full ${
                isPositive ? "bg-emerald-300" : "bg-rose-300"
              }`}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AIDecisionCenter;
