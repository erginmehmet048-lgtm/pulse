import { getHistoricalReaction } from "../services/historicalEngine";
import AnalysisBadge from "./AnalysisBadge";

function getImportanceScore(item) {
  const score = Number(item.importanceScore);

  return Number.isFinite(score) ? Math.min(Math.max(score, 0), 100) : 0;
}

const impactStyles = {
  High: "border-amber-300/20 bg-amber-300/[0.08] text-amber-300",
  Medium: "border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-300",
  Low: "border-slate-400/20 bg-slate-400/[0.08] text-slate-400",
};

function getPublishedTime(value) {
  const time = new Date(value).getTime();

  return Number.isFinite(time) ? time : 0;
}

function NewsFeed({ news }) {
  const sortedNews = [...(news || [])].sort(
    (first, second) =>
      getImportanceScore(second) - getImportanceScore(first) ||
      getPublishedTime(second.publishedAt) - getPublishedTime(first.publishedAt),
  );

  const formatDate = (value) => {
    if (!value) return "Yeni";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Yeni";

    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="mt-7">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Live intelligence
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Önemli Haber Akışı
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Karar etkisi yüksek gelişmeler önceliklendirilir.
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-400">
          {news?.length || 0} haber
        </span>
      </div>

      {!news?.length && (
        <div className="rounded-2xl border border-white/[0.07] bg-[#0b111d] p-8 text-center">
          <div className="mx-auto mb-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-300" />
          <p className="text-sm text-slate-400">Haber akışı hazırlanıyor…</p>
        </div>
      )}

      <div className="space-y-3">
        {sortedNews.map((item, index) => {
          const history = getHistoricalReaction(item.stock, item.eventType);
          const importanceScore = getImportanceScore(item);
          const isCriticalSignal = index < 3;
          const impactStyle =
            impactStyles[item.impactLabel] || impactStyles.Low;

          return (
            <article
              key={item.id}
              className={`group overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b111d] transition duration-300 hover:border-cyan-300/20 hover:bg-[#0d1421] ${
                isCriticalSignal
                  ? "ring-1 ring-inset ring-cyan-300/[0.12] shadow-[0_14px_35px_rgba(6,182,212,0.05)]"
                  : ""
              }`}
            >
              <div className="grid lg:grid-cols-[minmax(0,1fr)_260px]">
                <div className="min-w-0 p-5 sm:p-6">
                  <div className="mb-4 flex flex-wrap items-center gap-2.5">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${impactStyle}`}
                    >
                      {item.impactLabel} Impact
                    </span>
                    <AnalysisBadge sentiment={item.sentiment} />
                    <span className="text-xs font-medium text-slate-400">
                      {item.source || "Bilinmeyen kaynak"}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-slate-700" />
                    <span className="text-xs text-slate-600">
                      {formatDate(item.publishedAt)}
                    </span>
                  </div>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-start gap-2 text-lg font-semibold leading-7 tracking-[-0.015em] text-slate-100 transition group-hover:text-white sm:text-xl"
                  >
                    <span>{item.title}</span>
                    <svg viewBox="0 0 24 24" className="mt-1.5 h-3.5 w-3.5 shrink-0 text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </a>

                  <div className="mt-4 max-w-3xl rounded-xl border border-white/[0.06] bg-white/[0.025] p-3.5">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-cyan-300/70">
                      AI Summary
                    </p>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">
                      {item.shortSummary}
                    </p>
                  </div>

                  {!!item.tags?.length && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-white/[0.035] px-2 py-1 text-[10px] font-medium text-slate-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 border-t border-white/[0.06] bg-white/[0.015] lg:grid-cols-1 lg:border-l lg:border-t-0">
                  <div className="border-r border-white/[0.06] p-5 lg:border-b lg:border-r-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                      AI önem skoru
                    </p>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-semibold text-cyan-300">
                        {importanceScore}
                      </span>
                      <span className="text-xs text-slate-600">/100</span>
                    </div>
                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300"
                        style={{ width: `${Math.min(importanceScore, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                      Tarihsel tepki
                    </p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className={`text-2xl font-semibold ${
                        history.events > 0 ? "text-emerald-400" : "text-slate-400"
                      }`}>
                        {history.averageMove}
                      </span>
                      {history.events > 0 && (
                        <span className="text-xs text-slate-600">
                          {history.timeFrame}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      {history.events > 0
                        ? `${history.events} benzer olay · %${history.confidence} güven`
                        : "Benzer geçmiş olay bulunamadı"}
                    </p>
                  </div>
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
