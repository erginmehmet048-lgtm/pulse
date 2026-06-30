import AnalysisBadge from "./AnalysisBadge";

function NewsFeed({ news }) {
  return (
    <section className="mb-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Haber analizi
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
            Tüm Haberler
          </h2>
        </div>
        <span className="shrink-0 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-500">
          {news?.length || 0} haber
        </span>
      </div>

      {!news?.length && (
        <div className="rounded-2xl border border-white/[0.07] bg-[#0b111d] p-7 text-center">
          <div className="mx-auto mb-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-300" />
          <p className="text-sm text-slate-400">Haberler analiz ediliyor.</p>
        </div>
      )}

      <div className="space-y-3">
        {(news || []).map((item) => {
          const memory = item.historicalMemory;

          return (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b111d] transition hover:border-white/[0.12]"
            >
              <div className="grid lg:grid-cols-[minmax(0,1fr)_270px]">
                <div className="min-w-0 p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <AnalysisBadge sentiment={item.sentiment} />
                    <span className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.05] px-2.5 py-1 text-[10px] font-semibold text-cyan-200">
                      Önem: {item.importanceScore}/100
                    </span>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 block text-base font-semibold leading-6 text-slate-100 transition hover:text-cyan-200"
                  >
                    {item.title}
                  </a>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                    {item.shortSummary}
                  </p>
                </div>

                <div className="border-t border-white/[0.06] bg-white/[0.015] p-4 sm:p-5 lg:border-l lg:border-t-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                    Tarihsel Hafıza
                  </p>
                  {!memory || memory.insufficientData ? (
                    <p className="mt-3 text-xs text-slate-500">
                      Yeterli tarihsel veri yok.
                    </p>
                  ) : (
                    <>
                      <p className="mt-2 text-xs text-slate-400">
                        {memory.totalSimilarEvents} benzer olay
                      </p>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-slate-600">1G</span>
                          <p className="mt-1 font-semibold text-slate-300">
                            {memory.averageReaction1DLabel}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-600">3G</span>
                          <p className="mt-1 font-semibold text-slate-300">
                            {memory.averageReaction3DLabel}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-600">7G</span>
                          <p className="mt-1 font-semibold text-slate-300">
                            {memory.averageReaction7DLabel}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default NewsFeed;
