export async function fetchWikipediaSummary(topic: string) {
  try {
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch from Wikipedia');
    }
    const data = await response.json();
    return {
      title: data.title,
      extract: data.extract,
      url: data.content_urls?.desktop?.page,
      thumbnail: data.thumbnail?.source
    };
  } catch (error) {
    console.error("Wikipedia API Error:", error);
    return null;
  }
}
