const statusMessages = {
  "BUY WATCH": ({
    impactScore,
    status,
    importantNewsCount,
    similarEventsCount,
    positiveReactionRate,
  }) =>
    `${status} görünümünde ${impactScore}/100 AI Impact ve ${importantNewsCount} önemli haber, pozitif haber yoğunluğuna işaret ediyor. ${similarEventsCount} benzer olayda %${positiveReactionRate} pozitif tepki görülmesi olumlu bir tarihsel sinyal veriyor; haber akışı teyit için izleniyor.`,
  "NEUTRAL WATCH": ({
    impactScore,
    status,
    importantNewsCount,
    similarEventsCount,
    positiveReactionRate,
  }) =>
    `${status} görünümünde ${impactScore}/100 AI Impact ve ${importantNewsCount} önemli haber, karışık veya orta güçte bir haber akışına işaret ediyor. ${similarEventsCount} benzer olayda %${positiveReactionRate} pozitif tepki görülmüş olsa da bu veriler tek başına kesin bir yön sinyali vermiyor; yeni gelişmeler temkinli biçimde izlenmeli.`,
  "SELL/RISK WATCH": ({
    impactScore,
    status,
    importantNewsCount,
    similarEventsCount,
    positiveReactionRate,
  }) =>
    `${status} görünümünde ${impactScore}/100 AI Impact ve ${importantNewsCount} önemli haber, düşük skor veya negatif haber baskısıyla riskin artıyor olabileceği sinyalini veriyor. ${similarEventsCount} benzer olayda tarihsel pozitif tepki %${positiveReactionRate} olsa da güncel riskler yakından izlenmeli; bu görünüm kesin bir düşüş beklentisi veya yatırım tavsiyesi değildir.`,
};

const topSignalStatusMessages = {
  "BUY WATCH":
    "Bu yoğunluk olumlu bir eğilim sinyali veriyor; yön teyidi için yeni gelişmeler izlenmeye devam edilmeli.",
  "NEUTRAL WATCH":
    "Bu karışım orta güçte ve dengeli sinyaller veriyor; henüz kesin bir yön üretmediği için izleme yaklaşımı korunmalı.",
  "SELL/RISK WATCH":
    "Bu dağılım risk baskısının artıyor olabileceğine işaret ediyor; kesin bir yatırım yönü çıkarmadan riskler yakından izlenmeli.",
};

function shorten(text, length) {
  if (!text) return "Özet bilgisi bulunmuyor";
  const compactText = text.replace(/[.!?]+/g, "").replace(/\s+/g, " ").trim();
  return compactText.length > length
    ? `${compactText.slice(0, length).trim()}…`
    : compactText;
}

function InsightSummary({
  impactScore = 94,
  status = "BUY WATCH",
  importantNewsCount = 3,
  similarEventsCount = 17,
  positiveReactionRate = 82,
  topSignals = [],
}) {
  const messageMetrics = {
    impactScore,
    status,
    importantNewsCount,
    similarEventsCount,
    positiveReactionRate,
  };
  const statusMessage =
    statusMessages[status]?.(messageMetrics) ||
    statusMessages["NEUTRAL WATCH"](messageMetrics);
  const [primarySignal, ...otherSignals] = topSignals;
  const topSignalsSummary = primarySignal
    ? `En güçlü sinyal ${primarySignal.importanceScore}/100 puanla “${shorten(primarySignal.title, 70)}”; özeti “${shorten(primarySignal.summary, 90)}”. ${
        otherSignals.length
          ? `Diğer kritik sinyaller ${otherSignals
              .map(
                (signal) =>
                  `“${shorten(signal.title, 48)}” (${signal.importanceScore}/100, ${shorten(signal.summary, 55)})`,
              )
              .join(" ve ")}.`
          : ""
      } ${topSignalStatusMessages[status] || topSignalStatusMessages["NEUTRAL WATCH"]}`
    : "";

  return (
    <section className="mb-5 mt-7 overflow-hidden rounded-2xl border border-cyan-300/[0.12] bg-gradient-to-r from-cyan-400/[0.07] to-transparent p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-300">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M9 18h6M10 22h4M8.5 15.5A7 7 0 1 1 15.5 15.5c-.9.7-1.5 1.4-1.5 2.5h-4c0-1.1-.6-1.8-1.5-2.5Z" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Pulse AI Yorumu
          </p>
          <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-300 sm:text-[15px]">
            {statusMessage}
          </p>
          {topSignalsSummary && (
            <div className="mt-4 rounded-xl border border-white/[0.07] bg-black/10 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Top Signals Summary
              </p>
              <p className="mt-2 break-words text-sm leading-6 text-slate-400">
                {topSignalsSummary}
              </p>
            </div>
          )}
          <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-600">
            Yatırım tavsiyesi değildir
          </p>
        </div>
      </div>
    </section>
  );
}

export default InsightSummary;
