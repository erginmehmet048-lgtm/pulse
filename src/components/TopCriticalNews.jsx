import AnalysisBadge from "./AnalysisBadge";

const impactLabels = {
  High: "Yüksek etki",
  Medium: "Orta etki",
  Low: "Düşük etki",
};

function TopCriticalNews({ news }) {
  return (
    <section className="mb-6">
      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Karar katalizörleri
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
          En Kritik 3 Haber
        </h2>
      </div>

      {news.length ? (
        <div className="grid gap-3 lg:grid-cols-3">
          {news.map((item) => (
            <article
              key={item.id || item.title}
              className="flex min-w-0 flex-col rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <AnalysisBadge sentiment={item.sentiment} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                  {impactLabels[item.impactLabel]}
                </span>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 line-clamp-2 text-sm font-semibold leading-6 text-slate-100 transition hover:text-cyan-200"
              >
                {item.title}
              </a>
              <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">
                {item.summary}
              </p>
              <div className="mt-auto flex items-end justify-between border-t border-white/[0.06] pt-4">
                <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                  Önem skoru
                </span>
                <span className="text-lg font-semibold text-cyan-200">
                  {item.importanceScore}
                  <span className="ml-0.5 text-[10px] text-slate-600">
                    /100
                  </span>
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/[0.08] p-6 text-center text-sm text-slate-500">
          Kritik haberler analiz ediliyor.
        </div>
      )}
    </section>
  );
}

export default TopCriticalNews;
