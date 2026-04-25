import { fetchDefinition } from '@/lib/dictionary';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('fetchDefinition', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('returns parsed definition on success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([{
        word: 'algorithm',
        phonetic: '/ˈæl.ɡə.rɪ.ðəm/',
        meanings: [{
          partOfSpeech: 'noun',
          definitions: [{
            definition: 'A step-by-step procedure for solving a problem.',
            example: 'The sorting algorithm runs in O(n log n).',
          }],
        }],
      }]),
    });

    const result = await fetchDefinition('algorithm');

    expect(result).toEqual({
      word: 'algorithm',
      phonetic: '/ˈæl.ɡə.rɪ.ðəm/',
      definition: 'A step-by-step procedure for solving a problem.',
      example: 'The sorting algorithm runs in O(n log n).',
      partOfSpeech: 'noun',
    });
  });

  it('returns null when word is not found (API returns error)', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

    const result = await fetchDefinition('xyznonexistent');
    expect(result).toBeNull();
  });

  it('returns null on network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchDefinition('test');
    expect(result).toBeNull();
  });

  it('handles missing example gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([{
        word: 'test',
        meanings: [{
          partOfSpeech: 'noun',
          definitions: [{ definition: 'A procedure.' }],
        }],
      }]),
    });

    const result = await fetchDefinition('test');
    expect(result).not.toBeNull();
    expect(result!.example).toBeUndefined();
    expect(result!.definition).toBe('A procedure.');
  });

  it('handles missing phonetic gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([{
        word: 'test',
        meanings: [{
          partOfSpeech: 'verb',
          definitions: [{ definition: 'To try.' }],
        }],
      }]),
    });

    const result = await fetchDefinition('test');
    expect(result!.phonetic).toBeUndefined();
  });

  it('calls the correct API endpoint', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

    await fetchDefinition('neural');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.dictionaryapi.dev/api/v2/entries/en/neural'
    );
  });
});
