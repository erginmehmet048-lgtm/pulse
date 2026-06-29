export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">⌁</div>
        <div>
          <h2>Project Pulse</h2>
          <p>Haberi değil, etkisini öğren.</p>
        </div>
      </div>

      <nav className="menu">
        <a className="active" href="#">Ana Sayfa</a>
        <a href="#">Takip Listem</a>
        <a href="#">Pulse AI</a>
        <a href="#">Geçmiş Olaylar</a>
        <a href="#">Bildirimler</a>
        <a href="#">Ayarlar</a>
      </nav>

      <div className="profile">
        <strong>Mehmet Ergin</strong>
        <p>Pulse Yatırımcı · PRO</p>
      </div>
    </aside>
  );
}