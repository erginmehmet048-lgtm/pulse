import { analyzeNews } from "./aiService";

const API_URL = "https://api.spaceflightnewsapi.net/v4/articles/";

export async function getNews() {
  const response = await fetch(`${API_URL}?limit=10`);

  if (!response.ok) {
    throw new Error("Haberler alınamadı.");
  }

  const data = await response.json();

  const analyzedNews = await Promise.all(
    data.results.map(async (article) => {
      const analysis = await analyzeNews(article);

      return {
        id: article.id,
        title: article.title,
        summary: analysis.summary || article.summary,
        originalSummary: article.summary,
        url: article.url,
        source: article.news_site,
        publishedAt: article.published_at,
        imageUrl: article.image_url,

        stock: analysis.relatedStocks?.[0] || "SPCX",
        eventType: analysis.eventType || "general_news",
        importance: analysis.importance,
        sentiment: analysis.sentiment,
        decisionImpact: analysis.decisionImpact,
        confidence: analysis.confidence,
        ignore: analysis.ignore,
        tags: analysis.reasons || [],
      };
    })
  );

  return analyzedNews.filter((item) => !item.ignore);
}