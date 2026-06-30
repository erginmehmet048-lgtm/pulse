const sentimentStyles = {
  positive: {
    label: "Positive",
    icon: "↗",
    className:
      "border-emerald-400/25 bg-emerald-400/[0.09] text-emerald-300",
  },
  neutral: {
    label: "Neutral",
    icon: "→",
    className: "border-amber-300/25 bg-amber-300/[0.09] text-amber-200",
  },
  negative: {
    label: "Negative",
    icon: "↘",
    className: "border-rose-400/25 bg-rose-400/[0.09] text-rose-300",
  },
};

const riskStyles = {
  Low: "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300",
  Medium: "border-amber-300/20 bg-amber-300/[0.07] text-amber-200",
  High: "border-rose-400/20 bg-rose-400/[0.07] text-rose-300",
};

const historicalSignalStyles = {
  "Strong Positive":
    "border-emerald-300/25 bg-emerald-300/[0.09] text-emerald-200",
  "Weak Positive":
    "border-cyan-300/25 bg-cyan-300/[0.09] text-cyan-200",
  Neutral: "border-amber-300/20 bg-amber-300/[0.07] text-amber-200",
  "Weak Negative":
    "border-orange-300/20 bg-orange-300/[0.07] text-orange-200",
  "Strong Negative":
    "border-rose-300/25 bg-rose-300/[0.09] text-rose-200",
  "Insufficient Data":
    "border-slate-400/20 bg-slate-400/[0.06] text-slate-400",
};

function AIDecisionCenter({ explanation, symbol, summary }) {
  const sentiment =
    sentimentStyles[summary.overallSentiment] || sentimentStyles.neutral;
  const riskStyle = riskStyles[summary.riskLevel] || riskStyles.Medium;
  const historicalSignalStyle =
    historicalSignalStyles[summary.historicalSignal] ||
    historicalSignalStyles["Insufficient Data"];
  const newsMetrics = [
    { label: "Toplam", value: summary.newsCounts.total, tone: "text-white" },
    {
      label: "Positive",
      value: summary.newsCounts.positive,
      tone: "text-emerald-300",
    },
    {
      label: "Neutral",
      value: summary.newsCounts.neutral,
      tone: "text-amber-200",
    },
    {
      label: "Negative",
      value: summary.newsCounts.negative,
      tone: "text-rose-300",
    },
    {
      label: "High Impact",
      value: summary.newsCounts.highImpact,
      tone: "text-cyan-200",
    },
  ];
  const explanationItems = [
    {
      label: "Positive driver",
      text: explanation.positiveFactors.join(" "),
      icon: "+",
      iconStyle:
        "border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-200",
    },
    {
      label: "Risk driver",
      text: explanation.negativeFactors.join(" "),
      icon: "!",
      iconStyle: "border-rose-300/20 bg-rose-300/[0.08] text-rose-200",
    },
    {
      label: "Historical memory",
      text: explanation.historicalReason,
      icon: "↺",
      iconStyle: "border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-200",
    },
    {
      label: "Confidence reason",
      text: explanation.confidenceReason,
      icon: "%",
      iconStyle:
        "border-violet-300/20 bg-violet-300/[0.08] text-violet-200",
    },
    {
      label: "Final takeaway",
      text: explanation.finalTakeaway,
      icon: "→",
      iconStyle: "border-white/[0.1] bg-white/[0.05] text-slate-200",
    },
  ];

  return (
    <section className="relative mb-7 overflow-hidden rounded-[30px] border border-cyan-200/[0.16] bg-[#09111d] p-5 shadow-[0_35px_110px_rgba(0,0,0,0.38)] sm:p-7 lg:p-8">
      <div className="pointer-events-none absolute -right-28 -top-40 h-[420px] w-[420px] rounded-full bg-cyan-300/[0.12] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-44 -left-24 h-80 w-80 rounded-full bg-blue-600/[0.09] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] pb-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.09] text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.08)]">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3h8M9 3v3l-4.5 8.2A4.5 4.5 0 0 0 8.4 21h7.2a4.5 4.5 0 0 0 3.9-6.8L15 6V3" />
                <path d="M7 14h10M9.5 11h5" />
              </svg>
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
                Pulse Intelligence
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                AI Decision Center
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.08] px-3 py-1.5 text-xs font-bold tracking-[0.12em] text-cyan-200">
              {symbol}
            </span>
            <span className="hidden rounded-full border border-white/[0.08] bg-black/15 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:inline-flex">
              Rule-based v1
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(280px,0.78fr)_1.22fr]">
          <div className="rounded-2xl border border-white/[0.08] bg-black/15 p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  Genel görünüm
                </p>
                <span
                  className={`mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${sentiment.className}`}
                >
                  <span aria-hidden="true">{sentiment.icon}</span>
                  {sentiment.label}
                </span>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  Risk level
                </p>
                <span
                  className={`mt-3 inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${riskStyle}`}
                >
                  {summary.riskLevel}
                </span>
              </div>
            </div>

            <div className="mt-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  AI Impact Score
                </p>
                <p className="mt-2 text-6xl font-semibold leading-none tracking-[-0.06em] text-white">
                  {summary.averageImportance}
                  <span className="ml-1 text-sm font-medium tracking-normal text-slate-600">
                    /100
                  </span>
                </p>
              </div>
              <div className="min-w-24 text-right">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  Confidence
                </p>
                <p className="mt-2 text-2xl font-semibold text-cyan-200">
                  %{summary.averageConfidence}
                </p>
              </div>
            </div>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-cyan-200"
                style={{ width: `${summary.averageImportance}%` }}
              />
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                Historical Signal
              </p>
              <span
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${historicalSignalStyle}`}
              >
                {summary.historicalSignal}
              </span>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Haber özeti
                </p>
                <span className="text-[10px] text-slate-600">Canlı dağılım</span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {newsMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-xl border border-white/[0.06] bg-black/10 p-3"
                  >
                    <p className={`text-2xl font-semibold ${metric.tone}`}>
                      {metric.value}
                    </p>
                    <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.1em] text-slate-600">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Top 3 Most Important News
              </p>
              {summary.topNews.length ? (
                <ol className="space-y-2">
                  {summary.topNews.map((item, index) => (
                    <li
                      key={item.id || item.title}
                      className="grid grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-white/[0.05] bg-black/10 px-3 py-2.5"
                    >
                      <span className="text-[10px] font-semibold text-slate-600">
                        0{index + 1}
                      </span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate text-xs font-medium text-slate-300 transition hover:text-cyan-200 sm:text-sm"
                      >
                        {item.title}
                      </a>
                      <span className="text-xs font-semibold text-cyan-200">
                        {item.importanceScore}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="rounded-xl border border-dashed border-white/[0.08] px-4 py-5 text-center text-xs text-slate-600">
                  Önemli haberler analiz ediliyor…
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-cyan-300/[0.1] bg-gradient-to-r from-cyan-300/[0.07] to-transparent p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.8)]" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                AI Executive Summary
              </p>
              <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-300">
                {summary.executiveSummary}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/[0.08] bg-black/15 p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Why this score?
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Rule-based decision factors
              </p>
            </div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-700">
              5 signals
            </span>
          </div>

          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
            {explanationItems.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3.5"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border text-[10px] font-bold ${item.iconStyle}`}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {item.label}
                  </p>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AIDecisionCenter;
