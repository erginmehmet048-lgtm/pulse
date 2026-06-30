const variants = {
  positive: {
    label: "Positive",
    emoji: "🟢",
    className: "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-400",
  },
  negative: {
    label: "Negative",
    emoji: "🔴",
    className: "border-rose-400/20 bg-rose-400/[0.08] text-rose-400",
  },
  neutral: {
    label: "Neutral",
    emoji: "🟡",
    className: "border-slate-400/20 bg-slate-400/[0.08] text-slate-400",
  },
};

function AnalysisBadge({ sentiment = "neutral" }) {
  const variant = variants[sentiment.toLowerCase()] || variants.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${variant.className}`}
    >
      <span aria-hidden="true">{variant.emoji}</span>
      {variant.label}
    </span>
  );
}

export default AnalysisBadge;
