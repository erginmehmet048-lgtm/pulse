import Header from "./components/Header";
import NewsFeed from "./components/NewsFeed";
import StockCard from "./components/StockCard";

import stocks from "./data/stocks";
import { useNews } from "./hooks/useNews";

function Dashboard() {
  const news = useNews();

  return (
    <main className="flex-1 p-8">
      <Header />

      <p className="mb-6 text-green-400">
        Haber Sayısı: {news.length}
      </p>

      <div className="grid grid-cols-3 gap-6">
        {stocks.map((stock) => (
          <StockCard
            key={stock.symbol}
            symbol={stock.symbol}
            impact={stock.impact}
            expectedMove={stock.expectedMove}
            risk={stock.risk}
            summary={stock.summary}
          />
        ))}
      </div>

      <NewsFeed />
    </main>
  );
}

export default Dashboard;