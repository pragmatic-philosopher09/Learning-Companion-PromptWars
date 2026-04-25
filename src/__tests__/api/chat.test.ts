/**
 * @jest-environment node
 */
jest.mock('@/lib/gemini', () => ({ chatWithTutor: jest.fn() }));
jest.mock('@/lib/wikipedia', () => ({ fetchWikipediaSummary: jest.fn() }));
jest.mock('@/lib/openlibrary', () => ({ fetchRecommendedBooks: jest.fn() }));

import { POST } from '@/app/api/chat/route';
import { chatWithTutor } from '@/lib/gemini';
import { fetchWikipediaSummary } from '@/lib/wikipedia';
import { fetchRecommendedBooks } from '@/lib/openlibrary';

function req(body: any) {
  return new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/chat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (chatWithTutor as jest.Mock).mockResolvedValue('AI reply');
    (fetchWikipediaSummary as jest.Mock).mockResolvedValue(null);
    (fetchRecommendedBooks as jest.Mock).mockResolvedValue([]);
  });

  it('returns reply for valid request', async () => {
    const res = await POST(req({ messages: [{ role: 'user', parts: [{ text: 'Hi' }] }], topic: 'test' }));
    expect(res.status).toBe(200);
    expect((await res.json()).reply).toBe('AI reply');
  });

  it('returns 400 when messages missing', async () => {
    const res = await POST(req({ topic: 'test' }));
    expect(res.status).toBe(400);
  });

  it('enriches with topic DB data', async () => {
    await POST(req({ messages: [{ role: 'user', parts: [{ text: 'Hi' }] }], topic: 'machine learning' }));
    expect(chatWithTutor).toHaveBeenCalledWith(expect.any(Array), expect.stringContaining('CURATED TOPIC DATA'));
  });

  it('fetches Wikipedia for early messages', async () => {
    (fetchWikipediaSummary as jest.Mock).mockResolvedValue({ title: 'ML', extract: 'text', url: 'http://x' });
    const res = await POST(req({ messages: [{ role: 'user', parts: [{ text: 'Hi' }] }], topic: 'machine learning' }));
    const data = await res.json();
    expect(data.wikiData).not.toBeNull();
  });

  it('skips Wikipedia for later messages', async () => {
    const msgs = Array.from({ length: 6 }, (_, i) => ({ role: i % 2 === 0 ? 'user' : 'model', parts: [{ text: `m` }] }));
    await POST(req({ messages: msgs, topic: 'test' }));
    expect(fetchWikipediaSummary).not.toHaveBeenCalled();
  });

  it('returns related topics from DB', async () => {
    const res = await POST(req({ messages: [{ role: 'user', parts: [{ text: 'Hi' }] }], topic: 'quantum computing' }));
    expect((await res.json()).relatedTopics.length).toBeGreaterThan(0);
  });

  it('handles Gemini error', async () => {
    (chatWithTutor as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await POST(req({ messages: [{ role: 'user', parts: [{ text: 'Hi' }] }] }));
    expect(res.status).toBe(500);
  });

  it('works without topic', async () => {
    const res = await POST(req({ messages: [{ role: 'user', parts: [{ text: 'Hi' }] }] }));
    expect(res.status).toBe(200);
    expect((await res.json()).topicMeta).toBeNull();
  });
});
