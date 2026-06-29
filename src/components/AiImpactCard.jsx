const statusStyles = {
  "BUY WATCH": {
    badge:
      "border-emerald-400/20 bg-emerald-400/[0.09] text-emerald-400",
    description: "Yüksek pozitif etki sinyali",
  },
  "NEUTRAL WATCH": {
    badge: "border-amber-400/20 bg-amber-400/[0.09] text-amber-300",
    description: "Dengeli ve temkinli izleme",
  },
  "SELL/RISK WATCH": {
    badge: "border-rose-400/20 bg-rose-400/[0.09] text-rose-400",
    description: "Yüksek risk sinyali",
  },
};

function AiImpactCard({
  impactScore = 94,
  status = "BUY WATCH",
  importantNewsCount = 3,
  similarEventsCount = 17,
  positiveReactionRate = 82,
}) {
  const statusStyle = statusStyles[status] || statusStyles["NEUTRAL WATCH"];
  const metrics = [
    {
      label: "Bugün",
      value: importantNewsCount,
      suffix: "önemli haber",
      tone: "text-white",
    },
    {
      label: "Geçmiş veri",
      value: similarEventsCount,
      suffix: "benzer olay",
      tone: "text-white",
    },
    {
      label: "Tarihsel yön",
      value: `%${positiveReactionRate}`,
      suffix: "pozitif tepki",
      tone: "text-emerald-400",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-300/[0.13] bg-[#0a111d] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.22)] sm:p-7 lg:p-8">
      <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-cyan-400/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-px w-2/3 bg-gradient-to-l from-cyan-300/30 to-transparent" />

      <div className="relative grid gap-7 lg:grid-cols-[minmax(260px,0.8fr)_1.2fr] lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-300">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Pulse AI Etki
            </span>
          </div>

          <div className="mt-5 flex items-end gap-3">
            <span className="text-6xl font-semibold leading-none tracking-[-0.06em] text-white sm:text-7xl">
              {impactScore}
            </span>
            <span className="mb-1 text-lg font-medium text-slate-600">/100</span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold tracking-[0.08em] ${statusStyle.badge}`}
            >
              {status}
            </span>
            <span className="text-xs text-slate-500">
              {statusStyle.description}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="bg-[#0c1421] p-5 sm:min-h-32">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                {metric.label}
              </p>
              <p className={`mt-4 text-3xl font-semibold tracking-tight ${metric.tone}`}>
                {metric.value}
              </p>
              <p className="mt-1 text-xs text-slate-500">{metric.suffix}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AiImpactCard;
