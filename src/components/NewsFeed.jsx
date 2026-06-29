function NewsFeed() {
  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">📰 Son Haberler</h2>
          <p className="mt-1 text-sm text-slate-400">
            AI analizine girecek haber akışı
          </p>
        </div>

        <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-400">
          Live Feed
        </span>
      </div>

      <div className="space-y-4">
        <article className="rounded-xl border border-white/10 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">SpaceX</p>
          <h3 className="mt-1 font-semibold">
            Starship test süreci yatırımcı ilgisini artırıyor
          </h3>
          <p className="mt-3 text-sm text-slate-400">
            AI etkisi: Kısa vadede olumlu görünüm.
          </p>
        </article>

        <article className="rounded-xl border border-white/10 bg-slate-950 p-4">
          <p className="text-sm text-slate-400">NASA</p>
          <h3 className="mt-1 font-semibold">
            Yeni uzay anlaşmaları sektör beklentisini güçlendiriyor
          </h3>
          <p className="mt-3 text-sm text-slate-400">
            AI etkisi: Güven puanı yüksek.
          </p>
        </article>
      </div>
    </section>
  );
}

export default NewsFeed;