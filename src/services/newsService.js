const API_URL = "https://api.spaceflightnewsapi.net/v4/articles/";

export async function getNews() {
  const response = await fetch(`${API_URL}?limit=10`);

  if (!response.ok) {
    throw new Error("Haberler alınamadı.");
  }

  const data = await response.json();

  return data.results.map((article) => ({
    id: article.id,
    title: article.title,
    summary: article.summary,
    url: article.url,
    source: article.news_site,
    publishedAt: article.published_at,
    imageUrl: article.image_url,
  }));
}