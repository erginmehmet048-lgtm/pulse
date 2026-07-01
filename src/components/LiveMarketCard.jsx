function formatNumber(value, options = {}) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return new Intl.NumberFormat("tr-TR", options).format(number);
}

function formatTime(value) {
  if (!value) return "Güncelleme zamanı yok";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Güncelleme zamanı yok";
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function LiveMarketCard({ snapshot, marketName, isLoading = false }) {
  const price = Number(snapshot?.price);
  const change = Number(snapshot?.change);
  const changePercent = Number(snapshot?.changePercent);
  const isPositive = Number.isFinite(change) ? change >= 0 : true;
  const changeTone = isPositive ? "text-emerald-300" : "text-rose-300";
  const isLive = Boolean(snapshot?.isLive);

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#0b1320] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3 border-b border-white/[0.07] pb-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Market snapshot
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <h2 className="text-xl font-semibold text-white">
              {snapshot?.symbol || "—"}
            </h2>
            <span className="text-xs text-slate-600">{marketName || ""}</span>
          </div>
        </div>
        <span
          className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
            isLive
              ? "border-emerald-300/20 bg-emerald-300/[0.07] text-emerald-300"
              : "border-amber-300/20 bg-amber-300/[0.07] text-amber-200"
          }`}
        >
          {isLive ? "Canlı" : "Demo"}
        </span>
      </div>

      {isLoading ? (
        <div className="mt-6 h-36 animate-pulse rounded-2xl bg-white/[0.035]" />
      ) : (
        <>
          <div className="py-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
              Son fiyat
            </p>
            <p className="mt-2 break-words text-[clamp(2.5rem,8vw,4rem)] font-semibold leading-none tracking-[-0.06em] text-white">
              {formatNumber(price, { maximumFractionDigits: 2 })}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className={`text-sm font-semibold ${changeTone}`}>
                {isPositive ? "+" : ""}
                {formatNumber(change, { maximumFractionDigits: 2 })}
              </span>
              <span
                className={`rounded-lg bg-black/20 px-2.5 py-1.5 text-sm font-semibold ${changeTone}`}
              >
                {isPositive ? "+" : ""}
                {formatNumber(changePercent, { maximumFractionDigits: 2 })}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/[0.07]">
            <MarketStat label="Gün içi yüksek" value={snapshot?.high} />
            <MarketStat label="Gün içi düşük" value={snapshot?.low} />
            <MarketStat label="Açılış" value={snapshot?.open} />
            <MarketStat label="Önceki kapanış" value={snapshot?.previousClose} />
          </div>

          <div className="mt-5 flex flex-col gap-1 text-[10px] text-slate-600">
            <span>Güncelleme: {formatTime(snapshot?.updatedAt)}</span>
            <span>Sağlayıcı: {snapshot?.provider || "demo"}</span>
          </div>
        </>
      )}
    </section>
  );
}

function MarketStat({ label, value }) {
  return (
    <div className="bg-[#0b1320] p-3">
      <p className="text-[9px] uppercase tracking-[0.12em] text-slate-600">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-200">
        {formatNumber(value, { maximumFractionDigits: 2 })}
      </p>
    </div>
  );
}

export default LiveMarketCard;
