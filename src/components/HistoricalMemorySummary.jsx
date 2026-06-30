function HistoricalMemorySummary({ summary = {} }) {
  const matches = Array.isArray(summary.matches)
    ? summary.matches.filter((match) => match?.sourceReference)
    : [];
  const hasMatches = summary.status === "found" && matches.length > 0;
  const hasConfidence =
    Number.isFinite(summary.confidence) && summary.confidence > 0;
  const source = String(summary.metadata?.source || "").trim();

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

        {hasMatches ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:divide-x sm:divide-white/[0.08]">
            <div className="sm:px-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                Kaynaklı eşleşme
              </p>
              <p className="mt-1 text-lg font-semibold text-white">
                {matches.length}
              </p>
            </div>
            {hasConfidence && (
              <div className="sm:px-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                  Güven
                </p>
                <p className="mt-1 text-lg font-semibold text-cyan-200">
                  %{summary.confidence}
                </p>
              </div>
            )}
            {source && (
              <div className="sm:px-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                  Kaynak
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-300">
                  {source}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="rounded-full border border-slate-400/20 bg-slate-400/[0.06] px-4 py-2 text-sm text-slate-400">
            Yeterli geçmiş veri bulunamadı.
          </p>
        )}
      </div>
    </section>
  );
}

export default HistoricalMemorySummary;
