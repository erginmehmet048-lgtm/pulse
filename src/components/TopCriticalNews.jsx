import AnalysisBadge from "./AnalysisBadge";

function formatDate(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "Tarih yok";
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function TopCriticalNews({ isLoading = false, news = [] }) {
  const items = Array.isArray(news) ? news.filter(Boolean) : [];

  return (
    <section className="my-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Karar katalizörleri
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
            En kritik 3 haber
          </h2>
        </div>
        <span className="text-[10px] text-slate-600">
          İlişki skoruna göre
        </span>
      </div>

      {items.length ? (
        <div className="grid gap-3 lg:grid-cols-3">
          {items.map((item, index) => (
            <article
              key={item.id || item.title}
              className="flex min-w-0 flex-col rounded-2xl border border-white/[0.08] bg-[#0b1320] p-5 transition hover:-translate-y-0.5 hover:border-cyan-200/20"
            >
              <div className="flex items-center justify-between gap-2">
                <AnalysisBadge sentiment={item.sentimentHint} />
                <span className="text-[10px] font-semibold text-cyan-200">
                  #{index + 1} · {item.relevanceScore ?? 0}/100
                </span>
              </div>
              <h3 className="mt-4 line-clamp-3 text-base font-semibold leading-6 text-slate-100">
                {item.title || "Başlıksız haber"}
              </h3>
              <p className="mt-3 line-clamp-3 text-xs leading-5 text-slate-500">
                {item.summary || "Özet bulunmuyor."}
              </p>
              <div className="mt-auto pt-5">
                <div className="border-t border-white/[0.06] pt-4 text-[10px] text-slate-600">
                  <span>{item.source || "Bilinmeyen kaynak"}</span>
                  <span className="mx-2">·</span>
                  <time>{formatDate(item.publishedAt)}</time>
                </div>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex text-xs font-semibold text-cyan-300 transition hover:text-cyan-100"
                  >
                    Haberi aç ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/[0.08] p-7 text-center text-sm text-slate-500">
          {isLoading ? "Kritik haberler analiz ediliyor…" : "Haber bulunamadı."}
        </div>
      )}
    </section>
  );
}

export default TopCriticalNews;
