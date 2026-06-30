function HistoricalMemorySummary({ summary }) {
  return (
    <section className="mb-6 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Tarihsel Hafıza
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">
            Benzer olaylar ne söylüyor?
          </h2>
        </div>

        {summary.insufficientData ? (
          <p className="rounded-full border border-slate-400/20 bg-slate-400/[0.06] px-4 py-2 text-sm text-slate-400">
            Veri yetersiz
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:divide-x sm:divide-white/[0.08]">
            <div className="sm:px-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                Benzer olay
              </p>
              <p className="mt-1 text-lg font-semibold text-white">
                {summary.totalSimilarEvents}
              </p>
            </div>
            <div className="sm:px-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                Ortalama 7G
              </p>
              <p className="mt-1 text-lg font-semibold text-cyan-200">
                {summary.averageReaction7DLabel}
              </p>
            </div>
            <div className="sm:px-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                Pozitif oran
              </p>
              <p className="mt-1 text-lg font-semibold text-emerald-300">
                {summary.positiveRateLabel}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default HistoricalMemorySummary;
