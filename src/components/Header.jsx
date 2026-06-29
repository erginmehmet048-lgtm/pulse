function Header() {
  return (
    <header className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          Project Pulse kontrol merkezi
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-400">
          🔍 Haber, hisse veya sembol ara...
        </div>

        <button className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3">
          🔔
        </button>

        <div className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 font-semibold">
          👤 Mehmet
        </div>
      </div>
    </header>
  );
}

export default Header;