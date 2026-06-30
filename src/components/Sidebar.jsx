export default function Sidebar() {
  const menuItems = [
    { label: "Genel Bakış", icon: "grid", active: true },
    { label: "Haber Akışı", icon: "news" },
    { label: "Tarihsel Olaylar", icon: "history" },
    { label: "Takip Listem", icon: "watch" },
  ];

  const icons = {
    grid: <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />,
    news: <path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" />,
    history: <path d="M4 12a8 8 0 1 0 2.3-5.7L4 8.6M4 4v4.6h4.6M12 8v5l3 2" />,
    watch: <path d="M12 3 14.8 8.7 21 9.6l-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" />,
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-white/[0.07] bg-[#080d17]/90 px-5 py-7 backdrop-blur-xl xl:flex">
      <div className="flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-cyan-500 font-black text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.2)]">
          P
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white">Pulse</h2>
          <p className="text-[11px] text-slate-500">Intelligence Platform</p>
        </div>
      </div>

      <div className="mt-10 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
        Workspace
      </div>
      <nav className="mt-3 space-y-1">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
              item.active
                ? "bg-cyan-400/[0.09] font-medium text-cyan-300"
                : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px]"
              fill={item.icon === "grid" ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {icons[item.icon]}
            </svg>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs text-slate-500">Piyasa durumu</span>
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Açık
          </span>
        </div>
        <p className="text-sm font-medium text-slate-200">
          Çoklu piyasa takibi aktif
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Kritik gelişmeler gerçek zamanlı izleniyor.
        </p>
      </div>
    </aside>
  );
}
