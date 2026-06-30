function LiveMarketCard({
  symbol,
  name,
  marketName,
  price = 0,
  change = 0,
  changePercent = 0,
  currency = "USD",
  isLiveData = false,
  marketDataUnavailable = false,
}) {
  const isPositive = change >= 0;
  const changeTone = isPositive ? "text-emerald-300" : "text-rose-300";
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
    <section className="mb-6 overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.03] p-5 sm:p-6">
      {marketDataUnavailable ? (
        <div className="py-4">
          <span className="rounded-lg border border-slate-400/20 bg-slate-400/[0.06] px-2.5 py-1 text-xs font-bold tracking-[0.12em] text-slate-400">
            {symbol}
          </span>
          <h2 className="mt-4 text-xl font-semibold text-white">
            Piyasa verisi bulunamadı
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Başka bir sembolün fiyatı gösterilmiyor.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] pb-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Piyasa özeti
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-2">
                <h2 className="text-lg font-semibold text-white">{symbol}</h2>
                <span className="text-sm text-slate-500">{name}</span>
              </div>
            </div>
            <span
              className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                isLiveData
                  ? "border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-300"
                  : "border-amber-300/20 bg-amber-300/[0.07] text-amber-200"
              }`}
            >
              {isLiveData ? "Canlı veri" : "Demo veri"}
            </span>
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <p className="break-words text-[clamp(2.25rem,10vw,3.5rem)] font-semibold leading-none tracking-[-0.05em] text-white">
              {formattedPrice}
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              <span className={`text-base font-semibold ${changeTone}`}>
                {isPositive ? "+" : "-"}
                {currencySymbol}
                {Math.abs(change).toFixed(2)}
              </span>
              <span
                className={`rounded-lg bg-black/15 px-2.5 py-1.5 text-sm font-semibold ${changeTone}`}
              >
                {changePercent >= 0 ? "+" : ""}
                {changePercent.toFixed(2)}%
              </span>
            </div>
          </div>

          {!isLiveData && (
            <p className="mt-4 text-[11px] text-amber-200/65">
              Demo veri — gerçek zamanlı piyasa verisi değildir.
            </p>
          )}
          <p className="mt-1 text-[10px] text-slate-700">{marketName}</p>
        </>
      )}
    </section>
  );
}

export default LiveMarketCard;
