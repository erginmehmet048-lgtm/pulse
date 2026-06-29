function StockCard({
  symbol,
  impact,
  expectedMove,
  risk,
  summary,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-lg transition hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">🚀 {symbol}</h2>

        <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-400">
          AI +{impact}
        </span>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Beklenen Etki</span>
          <span className="font-semibold text-green-400">
            {expectedMove}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Risk</span>
          <span className="font-semibold text-yellow-400">
            {risk}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">Son Haber</span>
          <span>⭐⭐⭐⭐⭐</span>
        </div>
      </div>

      <div className="mt-6 border-t border-white/10 pt-4">
        <p className="mb-2 text-sm font-semibold text-cyan-400">
          🤖 AI Yorumu
        </p>

        <p className="text-sm leading-6 text-slate-300">
          {summary}
        </p>
      </div>
    </div>
  );
}

export default StockCard;