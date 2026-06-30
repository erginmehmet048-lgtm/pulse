const statusStyles = {
  "BUY WATCH": {
    label: "BUY",
    badge: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  },
  "NEUTRAL WATCH": {
    label: "NEUTRAL",
    badge: "border-amber-300/25 bg-amber-300/10 text-amber-300",
  },
  "SELL/RISK WATCH": {
    label: "RISK",
    badge: "border-rose-400/25 bg-rose-400/10 text-rose-300",
  },
};

function LiveMarketCard({
  symbol = "SPCX",
  name,
  marketName,
  price = 0,
  change = 0,
  changePercent = 0,
  currency = "USD",
  impactScore = 0,
  status = "NEUTRAL WATCH",
  importantNewsCount = 0,
  confidence = 0,
  lastUpdate = "-",
}) {
  const isPositive = change >= 0;
  const changeTone = isPositive ? "text-emerald-400" : "text-rose-400";
  const statusStyle = statusStyles[status] || statusStyles["NEUTRAL WATCH"];
  const companyName = name || `${symbol} Market Intelligence`;
  const formattedPrice = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(price));
  const currencySymbol =
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value ?? currency;

  return (
    <section className="relative mb-7 min-h-[340px] overflow-hidden rounded-[30px] border border-white/[0.11] bg-white/[0.04] p-5 shadow-[0_35px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8 lg:min-h-[370px] lg:p-10">
      <div className="pointer-events-none absolute -right-32 -top-44 h-[420px] w-[420px] rounded-full bg-cyan-300/[0.13] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-blue-500/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent" />

      <div className="relative flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
            Live Market
          </div>
          <span className="rounded-full border border-white/[0.09] bg-black/15 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
            {marketName} · Demo data
          </span>
        </div>

        <div className="mt-8 grid flex-1 gap-8 lg:grid-cols-[minmax(280px,0.9fr)_1.1fr] lg:items-end">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {companyName}
              </h2>
              <span className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.08] px-2.5 py-1 text-xs font-bold tracking-[0.12em] text-cyan-300">
                {symbol}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-end gap-x-5 gap-y-3">
              <p className="text-5xl font-semibold leading-none tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
                {formattedPrice}
              </p>
              <div className="pb-1">
                <p className={`text-lg font-semibold ${changeTone}`}>
                  {isPositive ? "+" : "-"}
                  {currencySymbol}
                  {Math.abs(change).toFixed(2)}
                </p>
                <p className={`mt-1 text-sm font-medium ${changeTone}`}>
                  {changePercent >= 0 ? "+" : ""}
                  {changePercent.toFixed(2)}% bugün
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full border px-3 py-1.5 text-xs font-bold tracking-[0.12em] ${statusStyle.badge}`}
              >
                {statusStyle.label}
              </span>
              <span className="text-xs text-slate-500">
                Pulse AI market görünümü
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08]">
            <div className="bg-[#0a111d]/85 p-4 sm:p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                AI Impact
              </p>
              <p className="mt-3 text-2xl font-semibold text-cyan-300 sm:text-3xl">
                {impactScore}
                <span className="ml-1 text-xs font-medium text-slate-600">
                  /100
                </span>
              </p>
            </div>
            <div className="bg-[#0a111d]/85 p-4 sm:p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                Critical Signals
              </p>
              <p className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                {importantNewsCount}
              </p>
            </div>
            <div className="bg-[#0a111d]/85 p-4 sm:p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                AI Confidence
              </p>
              <p className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                %{confidence}
              </p>
            </div>
            <div className="bg-[#0a111d]/85 p-4 sm:p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                Last Update
              </p>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-300 sm:text-base">
                {lastUpdate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LiveMarketCard;
