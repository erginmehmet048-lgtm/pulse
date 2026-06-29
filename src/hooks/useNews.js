import { useEffect, useState } from "react";
import { getNews } from "../services/newsService";

export function useNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function loadNews() {
      const data = await getNews();
      setNews(data);
    }

    loadNews();
  }, []);

  return news;
}