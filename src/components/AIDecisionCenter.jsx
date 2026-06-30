const decisionStyles = {
  "Strong Positive": {
    label: "Güçlü Pozitif",
    className: "text-emerald-200",
    badge: "border-emerald-300/25 bg-emerald-300/[0.09]",
  },
  Positive: {
    label: "Pozitif",
    className: "text-emerald-300",
    badge: "border-emerald-300/20 bg-emerald-300/[0.07]",
  },
  Neutral: {
    label: "Nötr",
    className: "text-amber-200",
    badge: "border-amber-300/20 bg-amber-300/[0.07]",
  },
  Negative: {
    label: "Negatif",
    className: "text-rose-300",
    badge: "border-rose-300/20 bg-rose-300/[0.07]",
  },
  "Strong Negative": {
    label: "Güçlü Negatif",
    className: "text-rose-200",
    badge: "border-rose-300/25 bg-rose-300/[0.09]",
  },
  "Insufficient Data": {
    label: "Veri yetersiz",
    className: "text-slate-400",
    badge: "border-slate-400/20 bg-slate-400/[0.06]",
  },
};

const riskLabels = {
  Low: "Düşük",
  Medium: "Orta",
  High: "Yüksek",
  "Insufficient Data": "Veri yetersiz",
};

const historicalLabels = {
  "Strong Positive": "Güçlü Pozitif",
  "Weak Positive": "Zayıf Pozitif",
  Neutral: "Nötr",
  "Weak Negative": "Zayıf Negatif",
  "Strong Negative": "Güçlü Negatif",
  "Insufficient Data": "Veri yetersiz",
};

function AIDecisionCenter({
  companyName,
  explanation,
  symbol,
  summary,
}) {
  const decision =
    decisionStyles[summary.decisionLabel] ||
    decisionStyles["Insufficient Data"];
  const explanationItems = [
    {
      label: "Ana pozitif etken",
      text: explanation.positiveFactors.join(" "),
      marker: "bg-emerald-300",
    },
    {
      label: "Ana risk etkeni",
      text: explanation.negativeFactors.join(" "),
      marker: "bg-rose-300",
    },
    {
      label: "Tarihsel hafıza",
      text: explanation.historicalReason,
      marker: "bg-cyan-300",
    },
    {
      label: "Sonuç",
      text: explanation.finalTakeaway,
      marker: "bg-white",
    },
  ];

  return (
    <section className="relative mb-6 overflow-hidden rounded-[28px] border border-cyan-200/[0.16] bg-[#09111d] p-5 shadow-[0_32px_90px_rgba(0,0,0,0.35)] sm:p-7 lg:p-8">
      <div className="pointer-events-none absolute -right-36 -top-48 h-[440px] w-[440px] rounded-full bg-cyan-300/[0.12] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
              Yapay Zeka Karar Merkezi
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-2">
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                {symbol}
              </h2>
              <span className="text-sm text-slate-500">{companyName}</span>
            </div>
          </div>
          <span
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${decision.badge} ${decision.className}`}
          >
            Yapay Zeka Kararı: {decision.label}
          </span>
        </div>

        <div className="grid gap-6 py-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              Ana Yapay Zeka Skoru
            </p>
            {summary.aiImpactScore === null ? (
              <p className="mt-3 text-2xl font-semibold text-slate-400">
                Veri yetersiz
              </p>
            ) : (
              <p className="mt-2 text-7xl font-semibold leading-none tracking-[-0.06em] text-white">
                {summary.aiImpactScore}
                <span className="ml-1 text-sm font-medium tracking-normal text-slate-600">
                  /100
                </span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 border-y border-white/[0.08] sm:grid-cols-3 sm:divide-x sm:divide-white/[0.08]">
            <div className="py-4 sm:px-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                Risk seviyesi
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {riskLabels[summary.riskLevel]}
              </p>
            </div>
            <div className="border-t border-white/[0.08] py-4 sm:border-t-0 sm:px-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                Güven seviyesi
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {summary.averageConfidence === null
                  ? "Veri yetersiz"
                  : `%${summary.averageConfidence}`}
              </p>
            </div>
            <div className="border-t border-white/[0.08] py-4 sm:border-t-0 sm:px-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                Tarihsel sinyal
              </p>
              <p className="mt-2 text-lg font-semibold text-cyan-200">
                {historicalLabels[summary.historicalSignal]}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.08] py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Yapay Zeka Özeti
          </p>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-300 sm:text-[15px]">
            {summary.decisionSummary}
          </p>
        </div>

        <div className="border-t border-white/[0.08] pt-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Neden bu skor?
          </p>
          <div className="mt-4 grid gap-x-8 gap-y-4 md:grid-cols-2">
            {explanationItems.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <span
                  className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${item.marker}`}
                />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AIDecisionCenter;
