import { analyzeNews } from "../services/aiService";

function NewsFeed({ news }) {
  const analyzedNews = news
    .map((item) => ({
      ...item,
      analysis: {
        relatedStocks: ["SPCX"],
        importance: 94,
        sentiment: "positive",
        decisionImpact: "high",
        confidence: 93,
        ignore: false,
        summary:
          "Starship gelişmesi kısa vadede SPCX için olumlu beklenti oluşturuyor.",
        reasons: ["Starship", "NASA", "Görev takvimi"],
      },
    }))
    .filter((item) => !item.analysis.ignore);

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">🧠 AI Noise Filter</h2>
          <p className="mt-1 text-sm text-slate-400">
            Önemsiz haberleri eler, sadece karar etkisi olanları gösterir.
          </p>
        </div>

        <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
          {news.length - analyzedNews.length} haber elendi
        </span>
      </div>

      <div className="space-y-4">
        {analyzedNews.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-white/10 bg-slate-950 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">{item.source}</p>

                <h3 className="mt-1 font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm text-slate-400">
                  {item.analysis.summary}
                </p>

                <div className="mt-3 flex gap-2">
                  {item.analysis.reasons.map((reason) => (
                    <span
                      key={reason}
                      className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-400"
                    >
                      {reason}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
                  {item.analysis.sentiment}
                </span>

                <p className="mt-3 text-sm text-slate-400">Önem</p>
                <p className="text-xl font-bold text-green-400">
                  {item.analysis.importance}
                </p>

                <p className="mt-2 text-sm text-slate-400">Güven</p>
                <p className="font-semibold text-cyan-400">
                  {item.analysis.confidence}%
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default NewsFeed;