import AnalysisBadge from "./AnalysisBadge";

function formatDate(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "Tarih yok";
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function NewsFeed({ isLoading = false, isFallback = false, news = [] }) {
  const items = Array.isArray(news) ? news.filter(Boolean) : [];

  return (
    <section className="mb-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Haber akışı
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
            Tüm haberler
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isFallback && (
            <span className="rounded-full border border-amber-300/15 bg-amber-300/[0.05] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-amber-200">
              Demo akış
            </span>
          )}
          <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-500">
            {items.length} haber
          </span>
        </div>
      </div>

      {!items.length && (
        <div className="rounded-2xl border border-white/[0.07] bg-[#0b1320] p-8 text-center">
          {isLoading && (
            <div className="mx-auto mb-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-300" />
          )}
          <p className="text-sm text-slate-400">
            {isLoading ? "Haberler yükleniyor…" : "Bu sembol için haber bulunamadı."}
          </p>
        </div>
      )}

      <div className="grid gap-3">
        {items.map((item) => (
          <article
            key={item.id || item.url || item.title}
            className="rounded-2xl border border-white/[0.07] bg-[#0b1320] p-4 transition hover:border-white/[0.13] sm:p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <AnalysisBadge sentiment={item.sentimentHint} />
                  <span className="text-[10px] text-slate-600">
                    {item.source || "Bilinmeyen kaynak"}
                  </span>
                  <span className="text-[10px] text-slate-700">·</span>
                  <time className="text-[10px] text-slate-600">
                    {formatDate(item.publishedAt)}
                  </time>
                </div>
                <h3 className="mt-3 text-base font-semibold leading-6 text-slate-100">
                  {item.title || "Başlıksız haber"}
                </h3>
                <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
                  {item.summary || "Özet bulunmuyor."}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
                <span className="rounded-xl border border-cyan-300/15 bg-cyan-300/[0.05] px-3 py-2 text-xs font-semibold text-cyan-200">
                  İlişki {item.relevanceScore ?? 0}/100
                </span>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-cyan-300 transition hover:text-cyan-100"
                  >
                    Haberi aç ↗
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default NewsFeed;
