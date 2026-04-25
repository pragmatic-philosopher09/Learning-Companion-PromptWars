import { fetchWikipediaSummary } from '@/lib/wikipedia';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('fetchWikipediaSummary', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('returns parsed Wikipedia data on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        title: 'Machine learning',
        extract: 'Machine learning is a subset of artificial intelligence...',
        content_urls: { desktop: { page: 'https://en.wikipedia.org/wiki/Machine_learning' } },
        thumbnail: { source: 'https://upload.wikimedia.org/thumb.jpg' },
      }),
    });

    const result = await fetchWikipediaSummary('Machine learning');

    expect(result).toEqual({
      title: 'Machine learning',
      extract: 'Machine learning is a subset of artificial intelligence...',
      url: 'https://en.wikipedia.org/wiki/Machine_learning',
      thumbnail: 'https://upload.wikimedia.org/thumb.jpg',
    });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('en.wikipedia.org/api/rest_v1/page/summary/')
    );
  });

  it('returns null on 404 (topic not found)', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

    const result = await fetchWikipediaSummary('xyznonexistenttopic');
    expect(result).toBeNull();
  });

  it('returns null on network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchWikipediaSummary('anything');
    expect(result).toBeNull();
  });

  it('handles missing thumbnail gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        title: 'Test',
        extract: 'Test extract',
        content_urls: { desktop: { page: 'https://example.com' } },
        // no thumbnail field
      }),
    });

    const result = await fetchWikipediaSummary('Test');
    expect(result).toEqual({
      title: 'Test',
      extract: 'Test extract',
      url: 'https://example.com',
      thumbnail: undefined,
    });
  });

  it('encodes special characters in topic name', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

    await fetchWikipediaSummary('Genetics & DNA');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('Genetics%20%26%20DNA')
    );
  });
});
