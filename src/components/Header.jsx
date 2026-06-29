function Header() {
  return (
    <header className="mb-7 flex items-start justify-between gap-5 border-b border-white/[0.07] pb-6">
      <div className="min-w-0">
        <div className="mb-3 flex items-center gap-2 xl:hidden">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-400 text-sm font-black text-slate-950">
            P
          </span>
          <span className="font-semibold tracking-tight text-white">Pulse</span>
        </div>
        <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.8)]" />
          Market intelligence
        </div>
        <h1 className="truncate text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
          SPCX Intelligence Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Haber akışını, piyasa etkisini ve geçmiş olayları tek bakışta izleyin.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="hidden items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs text-slate-400 md:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Canlı akış
        </div>
        <button
          type="button"
          aria-label="Bildirimler"
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-400 transition hover:border-cyan-400/30 hover:text-cyan-300"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
            <path d="M10 21h4" />
          </svg>
        </button>
      </div>
    </header>
  );
}

export default Header;
