import { useEffect, useState } from "react";
import { getNews } from "../services/newsService";

export function useNews({ market, symbol } = {}) {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!market || !symbol) {
      setNews([]);
      setIsLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    let isActive = true;

    async function loadNews() {
      setIsLoading(true);
      setNews([]);

      const data = await getNews({
        market,
        symbol,
        signal: controller.signal,
      });

      if (isActive) {
        setNews(data);
        setIsLoading(false);
      }
    }

    loadNews();
    return () => {
      isActive = false;
      controller.abort();
    };
  }, [market, symbol]);

  return { news, isLoading };
}
