import { NextResponse } from 'next/server';
import { chatWithTutor, ChatMessage } from '@/lib/gemini';
import { fetchWikipediaSummary } from '@/lib/wikipedia';

export async function POST(request: Request) {
  try {
    const { messages, topic } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    // Only fetch Wikipedia context if we have a detected topic
    // and it's the beginning of the conversation (to keep latency low later)
    let wikiContext = undefined;
    if (topic && messages.length <= 3) {
       const wikiData = await fetchWikipediaSummary(topic);
       if (wikiData?.extract) {
           wikiContext = wikiData.extract;
       }
    }

    const reply = await chatWithTutor(messages as ChatMessage[], wikiContext);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to generate chat response' }, { status: 500 });
  }
}
