import StockCard from "./components/StockCard";
import stocks from "./data/stocks";
import { useNews } from "./hooks/useNews";
import Header from "./components/Header";

function Dashboard() {
    const news = useNews();
  return (
    <main className="flex-1 p-8">
      

      <p className="mt-2 text-slate-400">
        <p className="mt-4 text-green-400">
  Haber Sayısı: {news.length}
</p><Header />
      </p>

      <div className="mt-8 grid grid-cols-3 gap-6">
        {stocks.map((stock) => (
  <StockCard
    key={stock.symbol}
    symbol={stock.symbol}
    impact={stock.impact}
    expectedMove={stock.expectedMove}
    risk={stock.risk}
  />
))}
      </div>
    </main>
  );
}

export default Dashboard;