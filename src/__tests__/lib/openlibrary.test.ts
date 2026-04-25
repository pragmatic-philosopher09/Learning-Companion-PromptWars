import { fetchRecommendedBooks } from '@/lib/openlibrary';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('fetchRecommendedBooks', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('returns parsed book data on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        docs: [
          { title: 'AI Fundamentals', author_name: ['John Doe'], cover_i: 12345 },
          { title: 'Deep Learning', author_name: ['Jane Smith'], cover_i: 67890 },
        ],
      }),
    });

    const result = await fetchRecommendedBooks('machine learning');

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      title: 'AI Fundamentals',
      author: 'John Doe',
      coverUrl: 'https://covers.openlibrary.org/b/id/12345-M.jpg',
    });
  });

  it('returns empty array on API error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    const result = await fetchRecommendedBooks('test');
    expect(result).toEqual([]);
  });

  it('returns empty array on network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network failure'));

    const result = await fetchRecommendedBooks('test');
    expect(result).toEqual([]);
  });

  it('handles books without cover images', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        docs: [{ title: 'No Cover Book', author_name: ['Author'] }],
      }),
    });

    const result = await fetchRecommendedBooks('test');
    expect(result[0].coverUrl).toBeUndefined();
  });

  it('handles books without author', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        docs: [{ title: 'Unknown Author Book', cover_i: 111 }],
      }),
    });

    const result = await fetchRecommendedBooks('test');
    expect(result[0].author).toBe('Unknown');
  });

  it('limits results to 5 books', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        docs: Array.from({ length: 10 }, (_, i) => ({
          title: `Book ${i}`,
          author_name: [`Author ${i}`],
        })),
      }),
    });

    const result = await fetchRecommendedBooks('test');
    expect(result.length).toBeLessThanOrEqual(5);
  });

  it('handles empty docs array', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ docs: [] }),
    });

    const result = await fetchRecommendedBooks('test');
    expect(result).toEqual([]);
  });
});
