// Open Library API — fetches recommended books for a topic
export interface BookResult {
  title: string;
  author: string;
  coverUrl?: string;
}

export async function fetchRecommendedBooks(topic: string): Promise<BookResult[]> {
  try {
    const res = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(topic)}&limit=5&fields=title,author_name,cover_i`
    );
    if (!res.ok) return [];
    const data = await res.json();
    
    return (data.docs || []).slice(0, 5).map((doc: any) => ({
      title: doc.title,
      author: doc.author_name?.[0] || 'Unknown',
      coverUrl: doc.cover_i 
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` 
        : undefined,
    }));
  } catch (error) {
    console.error('Open Library API Error:', error);
    return [];
  }
}
