export async function getNews() {
  const response = await fetch(
    "https://api.spaceflightnewsapi.net/v4/articles/?limit=5"
  );

  const data = await response.json();

  return data.results;
}
