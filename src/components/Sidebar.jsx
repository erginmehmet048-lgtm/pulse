export default function Sidebar() {
  const isLiveConfigured = Boolean(
    String(import.meta.env.VITE_FINNHUB_API_KEY || "").trim(),
  );
  const menuItems = [
    { label: "Dashboard", icon: "grid", active: true },
    { label: "İzleme Listesi", icon: "watch" },
    { label: "Ayarlar", icon: "settings" },
  ];
  const icons = {
    grid: <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />,
    watch: <path d="M12 3 14.8 8.7 21 9.6l-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" />,
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H3v-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6V3h4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 flex-col border-r border-white/[0.07] bg-[#080d17]/90 px-5 py-7 backdrop-blur-xl xl:flex">
      <div className="flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-cyan-500 font-black text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.2)]">
          N
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white">
            Pulse
          </h2>
          <p className="text-[11px] text-slate-500">
            Investment Intelligence
          </p>
        </div>
      </div>

      <nav className="mt-10 space-y-1">
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

      <div className="mt-auto rounded-2xl border border-amber-300/[0.1] bg-amber-300/[0.035] p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-200/70">
          {isLiveConfigured ? "Canlı veri hazır" : "Demo veri modu"}
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          {isLiveConfigured
            ? "Piyasa fiyatları Finnhub üzerinden güncellenir."
            : "API anahtarı eklenene kadar güvenli demo fiyatları kullanılır."}
        </p>
      </div>
    </aside>
  );
}
