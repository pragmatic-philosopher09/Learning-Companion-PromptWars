/**
 * @jest-environment node
 */
describe('gemini', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, GEMINI_API_KEY: 'test-key-123' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('calls Gemini with correct model and system prompt', async () => {
    const mockGenerate = jest.fn().mockResolvedValue({ text: 'Hello!' });
    jest.doMock('@google/genai', () => ({
      GoogleGenAI: jest.fn(() => ({ models: { generateContent: mockGenerate } })),
    }));

    const { chatWithTutor } = await import('@/lib/gemini');
    const result = await chatWithTutor([{ role: 'user', parts: [{ text: 'Hi' }] }]);

    expect(result).toBe('Hello!');
    expect(mockGenerate).toHaveBeenCalledWith(expect.objectContaining({
      model: 'gemini-2.5-flash',
      config: expect.objectContaining({
        systemInstruction: expect.stringContaining('Learning Companion'),
        temperature: 0.7,
      }),
    }));
  });

  it('appends enrichment context to system prompt', async () => {
    const mockGenerate = jest.fn().mockResolvedValue({ text: 'Enriched!' });
    jest.doMock('@google/genai', () => ({
      GoogleGenAI: jest.fn(() => ({ models: { generateContent: mockGenerate } })),
    }));

    const { chatWithTutor } = await import('@/lib/gemini');
    await chatWithTutor([{ role: 'user', parts: [{ text: 'ML' }] }], 'WIKI: ML is AI');

    const prompt = mockGenerate.mock.calls[0][0].config.systemInstruction;
    expect(prompt).toContain('BACKGROUND CONTEXT');
    expect(prompt).toContain('WIKI: ML is AI');
  });

  it('retries on 429 rate limit', async () => {
    const err429 = Object.assign(new Error('Rate limited'), { status: 429 });
    const mockGenerate = jest.fn()
      .mockRejectedValueOnce(err429)
      .mockResolvedValueOnce({ text: 'Retried OK' });

    jest.doMock('@google/genai', () => ({
      GoogleGenAI: jest.fn(() => ({ models: { generateContent: mockGenerate } })),
    }));

    const { chatWithTutor } = await import('@/lib/gemini');
    const result = await chatWithTutor([{ role: 'user', parts: [{ text: 'test' }] }]);

    expect(mockGenerate).toHaveBeenCalledTimes(2);
    expect(result).toBe('Retried OK');
  }, 30000);

  it('returns friendly error for API key issues', async () => {
    const keyErr = new Error('API key not valid');
    jest.doMock('@google/genai', () => ({
      GoogleGenAI: jest.fn(() => ({ models: { generateContent: jest.fn().mockRejectedValue(keyErr) } })),
    }));

    const { chatWithTutor } = await import('@/lib/gemini');
    const result = await chatWithTutor([{ role: 'user', parts: [{ text: 'test' }] }]);
    expect(result).toContain('API key');
  });

  it('returns fallback on generic error', async () => {
    jest.doMock('@google/genai', () => ({
      GoogleGenAI: jest.fn(() => ({ models: { generateContent: jest.fn().mockRejectedValue(new Error('oops')) } })),
    }));

    const { chatWithTutor } = await import('@/lib/gemini');
    const result = await chatWithTutor([{ role: 'user', parts: [{ text: 'test' }] }]);
    expect(result).toContain('connection issue');
  });

  it('system prompt has key teaching rules', async () => {
    const mockGenerate = jest.fn().mockResolvedValue({ text: 'ok' });
    jest.doMock('@google/genai', () => ({
      GoogleGenAI: jest.fn(() => ({ models: { generateContent: mockGenerate } })),
    }));

    const { chatWithTutor } = await import('@/lib/gemini');
    await chatWithTutor([{ role: 'user', parts: [{ text: 'hi' }] }]);

    const prompt = mockGenerate.mock.calls[0][0].config.systemInstruction;
    expect(prompt).toContain('ASSESS BEFORE YOU TEACH');
    expect(prompt).toContain('TEACH IN SMALL CHUNKS');
    expect(prompt).toContain('quiz');
  });
});
